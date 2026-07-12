/// <reference types="jest" />
/// <reference types="node" />

import { Test, TestingModule } from '@nestjs/testing';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';
import { ConsumerController } from './consumer.controller';
import { ConsumerService, TICKET_REPOSITORY as CS_TICKET_REPOSITORY, SERVICE_OBJECT_REPOSITORY as CS_SERVICE_OBJECT_REPOSITORY } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { RmqContext } from '@nestjs/microservices';
import { ImportTicketHandler } from '@/application/ticket/commands/import-ticket.handler';
import { TicketRepository } from '@/infrastructure/repository/ticket-repository';
import { ServiceObjectRepository } from '@/infrastructure/repository/service-object-repository';
import { TICKET_REPOSITORY as DOMAIN_TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { SERVICE_OBJECT_REPOSITORY as DOMAIN_SERVICE_OBJECT_REPOSITORY } from '@/domain/repository/iservice-object-repository';

// Моки для Sequelize-моделей — ДО импорта самих моделей
jest.mock('@/infrastructure/database/models/ticket.model', () => ({
  Ticket: {
    upsert: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('@/infrastructure/database/models/service-object.model', () => ({
  ServiceObject: {
    upsert: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('@/infrastructure/database/database', () => ({
  sequelize: {
    authenticate: jest.fn(),
    sync: jest.fn(),
    define: jest.fn(),
    transaction: jest.fn(),
    models: {},
  },
  syncDatabase: jest.fn(),
}));

// Импортируем замокированные модели
import { Ticket } from '@/infrastructure/database/models/ticket.model';
import { ServiceObject } from '@/infrastructure/database/models/service-object.model';

const MockTicket = Ticket as jest.Mocked<typeof Ticket>;
const MockServiceObject = ServiceObject as jest.Mocked<typeof ServiceObject>;

describe('ConsumerController — сквозной тест handleTicketImport', () => {
  let controller: ConsumerController;
  let mockRmqContext: jest.Mocked<RmqContext>;
  let mockChannel: any;
  let mockMessage: any;

  const createTicketData = (): TicketImportDto => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    consumer_id: 1,
    consumer_email: 'test@example.com',
    assignee_id: 2,
    status: 'open',
    service: 'cleaning',
    created_by: 3,
    created_time: '2023-01-01T10:00:00Z',
    deadline: '2023-01-02T10:00:00Z',
    act_type: 'standard',
    wiki_link: 'https://wiki.example.com',
    is_service_change_available: true,
    service_object: {
      address: '123 Main St',
      name: 'Test Object',
      search_code: 'ABC123',
      coords: {
        lat: '55.7558',
        lng: '37.6173',
      },
      phone_number: '+79991234567',
    },
  });

  beforeEach(async () => {
    // Сброс моков перед каждым тестом
    jest.clearAllMocks();

    // Настройка моков для upsert
    const mockTicketInstance = { id: '123e4567-e89b-12d3-a456-426614174000' };
    const mockServiceObjectInstance = { id: 'so-uuid-12345' };

    (MockTicket.upsert as jest.Mock).mockResolvedValue([mockTicketInstance, true]);
    (MockServiceObject.upsert as jest.Mock).mockResolvedValue([mockServiceObjectInstance, true]);

    // Мок для RmqContext
    mockChannel = { ack: jest.fn() };
    mockMessage = {};
    mockRmqContext = {
      getChannelRef: jest.fn(() => mockChannel),
      getMessage: jest.fn(() => mockMessage),
    } as unknown as jest.Mocked<RmqContext>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule.forRoot()],
      controllers: [ConsumerController],
      providers: [
        ConsumerService,
        ImportTicketHandler,
        // ConsumerService использует свои токены (из consumer.service.ts)
        {
          provide: CS_TICKET_REPOSITORY,
          useClass: TicketRepository,
        },
        {
          provide: CS_SERVICE_OBJECT_REPOSITORY,
          useClass: ServiceObjectRepository,
        },
        // ImportTicketHandler использует токены из domain/repository
        {
          provide: DOMAIN_TICKET_REPOSITORY,
          useClass: TicketRepository,
        },
        {
          provide: DOMAIN_SERVICE_OBJECT_REPOSITORY,
          useClass: ServiceObjectRepository,
        },
      ],
    }).compile();

    // Явно инициализируем модуль, чтобы CqrsModule.onApplicationBootstrap() зарегистрировал хендлеры
    await module.init();

    controller = module.get<ConsumerController>(ConsumerController);
  });

  it('должен вызывать Ticket.upsert и ServiceObject.upsert с корректными данными через полную цепочку', async () => {
    const ticketData = createTicketData();

    // Вызов контроллера — он идёт через CommandBus → ImportTicketHandler → репозитории → Sequelize модели
    await controller.handleTicketImport(ticketData, mockRmqContext);

    // === Проверка Ticket.upsert ===
    expect(MockTicket.upsert).toHaveBeenCalledTimes(1);
    const ticketUpsertArgs = (MockTicket.upsert as jest.Mock).mock.calls[0];
    expect(ticketUpsertArgs[0]).toMatchObject({
      id: ticketData.id,
      consumer_id: ticketData.consumer_id,
      consumer_email: ticketData.consumer_email,
      assignee_id: ticketData.assignee_id,
      status: ticketData.status,
      service: ticketData.service,
      created_by: ticketData.created_by,
      created_time: new Date(ticketData.created_time),
      deadline: new Date(ticketData.deadline),
      act_type: ticketData.act_type,
      wiki_link: ticketData.wiki_link,
      is_service_change_available: ticketData.is_service_change_available,
    });
    // Второй аргумент — options: { transaction: null }
    expect(ticketUpsertArgs[1]).toEqual({ transaction: null });

    // === Проверка ServiceObject.upsert ===
    expect(MockServiceObject.upsert).toHaveBeenCalledTimes(1);
    const serviceObjectUpsertArgs = (MockServiceObject.upsert as jest.Mock).mock.calls[0];
    expect(serviceObjectUpsertArgs[0]).toMatchObject({
      address: ticketData.service_object.address,
      name: ticketData.service_object.name,
      search_code: ticketData.service_object.search_code,
      lat: ticketData.service_object.coords.lat,
      lng: ticketData.service_object.coords.lng,
      phone_number: ticketData.service_object.phone_number,
      ticket_id: ticketData.id,
    });
    expect(serviceObjectUpsertArgs[1]).toEqual({ transaction: null });

    // === Проверка ack (подтверждение сообщения RabbitMQ) ===
    expect(mockRmqContext.getChannelRef).toHaveBeenCalled();
    expect(mockRmqContext.getMessage).toHaveBeenCalled();
    expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
  });

  it('должен пробрасывать ошибку из репозитория и НЕ вызывать ack', async () => {
    const ticketData = createTicketData();

    // Имитируем ошибку в Ticket.upsert
    const testError = new Error('Database error');
    (MockTicket.upsert as jest.Mock).mockRejectedValue(testError);

    // Ожидаем, что ошибка пробросится наружу
    await expect(
      controller.handleTicketImport(ticketData, mockRmqContext),
    ).rejects.toThrow('Database error');

    // ack НЕ должен быть вызван при ошибке
    expect(mockRmqContext.getChannelRef).not.toHaveBeenCalled();
    expect(mockRmqContext.getMessage).not.toHaveBeenCalled();
    expect(mockChannel.ack).not.toHaveBeenCalled();
  });
});
