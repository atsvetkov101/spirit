/// <reference types="jest" />
/// <reference types="node" />

import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { RmqContext } from '@nestjs/microservices';

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let consumerService: jest.Mocked<ConsumerService>;
  let mockRmqContext: jest.Mocked<RmqContext>;
  let mockChannel: any;
  let mockMessage: any;

  beforeEach(async () => {
    // Мок для ConsumerService
    const mockConsumerService = {
      handleTicketImport: jest.fn(),
      handleUserCreated: jest.fn(),
      handleOrderPlaced: jest.fn(),
    };

    // Мок для RmqContext
    mockChannel = {
      ack: jest.fn(),
    };
    mockMessage = {};

    mockRmqContext = {
      getChannelRef: jest.fn(() => mockChannel),
      getMessage: jest.fn(() => mockMessage),
    } as unknown as jest.Mocked<RmqContext>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
      providers: [
        {
          provide: ConsumerService,
          useValue: mockConsumerService,
        },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    consumerService = module.get(ConsumerService) as jest.Mocked<ConsumerService>;
  });

  describe('handleTicketImport', () => {
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

    it('должен вызывать consumerService.handleTicketImport с корректными данными и подтверждать сообщение', async () => {
      const ticketData = createTicketData();

      await controller.handleTicketImport(ticketData, mockRmqContext);

      expect(consumerService.handleTicketImport).toHaveBeenCalledWith(ticketData);
      expect(mockRmqContext.getChannelRef).toHaveBeenCalled();
      expect(mockRmqContext.getMessage).toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('при ошибке в сервисе не должен вызывать getChannelRef, getMessage и ack', async () => {
      const ticketData = createTicketData();
      const error = new Error('Service error');
      consumerService.handleTicketImport.mockRejectedValue(error);

      await expect(controller.handleTicketImport(ticketData, mockRmqContext)).rejects.toThrow(error);

      expect(consumerService.handleTicketImport).toHaveBeenCalledWith(ticketData);
      // При ошибке следующие вызовы не должны происходить
      expect(mockRmqContext.getChannelRef).not.toHaveBeenCalled();
      expect(mockRmqContext.getMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });


    it('должен вызывать ack после успешного выполнения сервиса', async () => {
      const ticketData = createTicketData();
      // Создаем фиктивные объекты, которые возвращает сервис
      const mockResult = {
        ticketId: ticketData.id,
        serviceObjectId: 'service-obj-id',
      };
      consumerService.handleTicketImport.mockResolvedValue(mockResult);

      // Поскольку контроллер не async, мы просто вызываем его
      controller.handleTicketImport(ticketData, mockRmqContext);

      // Даем возможность асинхронному вызову завершиться
      await Promise.resolve();

      expect(mockChannel.ack).toHaveBeenCalledTimes(1);
    });
  });
});