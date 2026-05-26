/// <reference types="jest" />
/// <reference types="node" />

import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService, TICKET_REPOSITORY, SERVICE_OBJECT_REPOSITORY } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { RmqContext } from '@nestjs/microservices';
import { TicketRepository } from '@/infrastructure/ticket-repository';
import { ServiceObjectRepository } from '@/infrastructure/service-object-repository';

// Моки для моделей и sequelize
jest.mock('../../models/ticket.model', () => ({
  Ticket: {
    upsert: jest.fn(),
  },
}));
jest.mock('../../models/service-object.model', () => ({
  ServiceObject: {
    upsert: jest.fn(),
  },
}));
jest.mock('../../database', () => ({
  sequelize: {
    transaction: jest.fn(),
  },
}));

import { Ticket } from '../../models/ticket.model';
import { ServiceObject } from '../../models/service-object.model';
import { sequelize } from '../../database';

const MockTicket = Ticket as jest.Mocked<typeof Ticket>;
const MockServiceObject = ServiceObject as jest.Mocked<typeof ServiceObject>;
const MockSequelize = sequelize as jest.Mocked<typeof sequelize>;

describe('Тесты Consumer Controller Model', () => {
  describe('Тесты handleTicketImport Models', () => {
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

    it('должен вызывать методы Ticket.upsert и ServiceObject.upsert с корректными данными', async () => {
      // Сбросим моки
      jest.clearAllMocks();

      const ticketData = createTicketData();
      const mockTicketInstance = { id: ticketData.id };
      const mockServiceObjectInstance = { id: 'service-object-id' };

      // Настраиваем моки (транзакция больше не используется)
      (MockTicket.upsert as jest.Mock).mockResolvedValue([mockTicketInstance, true]);
      (MockServiceObject.upsert as jest.Mock).mockResolvedValue([mockServiceObjectInstance, true]);

      // Создаем мок RmqContext
      const mockChannel = { ack: jest.fn() };
      const mockMessage = {};
      const mockRmqContext = {
        getChannelRef: jest.fn(() => mockChannel),
        getMessage: jest.fn(() => mockMessage),
      } as unknown as jest.Mocked<RmqContext>;

      // Создаем модуль с реальным ConsumerService и ConsumerController
      const testingModule: TestingModule = await Test.createTestingModule({
        controllers: [ConsumerController],
        providers: [
          ConsumerService,
          {
            provide: TICKET_REPOSITORY,
            useClass: TicketRepository,
          },
          {
            provide: SERVICE_OBJECT_REPOSITORY,
            useClass: ServiceObjectRepository,
          },
        ],
      }).compile();

      const realConsumerController = testingModule.get<ConsumerController>(ConsumerController);

      // Вызываем метод контроллера
      await realConsumerController.handleTicketImport(ticketData, mockRmqContext);

      // Проверяем, что transaction НЕ был вызван (так как транзакция убрана)
      expect(MockSequelize.transaction).not.toHaveBeenCalled();

      // Проверяем вызов Ticket.upsert с корректными данными
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
      // Второй аргумент должен быть { transaction: null } (по умолчанию передается null)
      expect(ticketUpsertArgs[1]).toEqual({ transaction: null });

      // Проверяем вызов ServiceObject.upsert с корректными данными
      expect(MockServiceObject.upsert).toHaveBeenCalledTimes(1);
      const serviceObjectUpsertArgs = (MockServiceObject.upsert as jest.Mock).mock.calls[0];
      expect(serviceObjectUpsertArgs[0]).toMatchObject({
        address: ticketData.service_object.address,
        name: ticketData.service_object.name,
        search_code: ticketData.service_object.search_code,
        lat: ticketData.service_object.coords.lat,
        lng: ticketData.service_object.coords.lng,
        phone_number: ticketData.service_object.phone_number,
        ticket_id: mockTicketInstance.id,
      });
      expect(serviceObjectUpsertArgs[1]).toEqual({ transaction: null });

      // Проверяем, что ack был вызван
      expect(mockRmqContext.getChannelRef).toHaveBeenCalled();
      expect(mockRmqContext.getMessage).toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});