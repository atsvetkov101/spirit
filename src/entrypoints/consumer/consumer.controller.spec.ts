/// <reference types="jest" />
/// <reference types="node" />

import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { RmqContext } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';

describe('ConsumerController', () => {
  let controller: ConsumerController;
  let consumerService: jest.Mocked<ConsumerService>;
  let commandBus: jest.Mocked<CommandBus>;
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

    // Мок для CommandBus
    const mockCommandBus = {
      execute: jest.fn(),
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
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
    consumerService = module.get(ConsumerService) as jest.Mocked<ConsumerService>;
    commandBus = module.get(CommandBus) as jest.Mocked<CommandBus>;
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

    it('должен вызывать commandBus.execute с ImportTicketCommand и подтверждать сообщение', async () => {
      const ticketData = createTicketData();
      commandBus.execute.mockResolvedValue(undefined);

      await controller.handleTicketImport(ticketData, mockRmqContext);

      expect(commandBus.execute).toHaveBeenCalled();
      expect(mockRmqContext.getChannelRef).toHaveBeenCalled();
      expect(mockRmqContext.getMessage).toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });

    it('при ошибке в commandBus не должен вызывать getChannelRef, getMessage и ack', async () => {
      const ticketData = createTicketData();
      const error = new Error('Service error');
      commandBus.execute.mockRejectedValue(error);

      await expect(controller.handleTicketImport(ticketData, mockRmqContext)).rejects.toThrow(error);

      expect(commandBus.execute).toHaveBeenCalled();
      // При ошибке следующие вызовы не должны происходить
      expect(mockRmqContext.getChannelRef).not.toHaveBeenCalled();
      expect(mockRmqContext.getMessage).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    it('должен вызывать ack после успешного выполнения commandBus', async () => {
      const ticketData = createTicketData();
      commandBus.execute.mockResolvedValue(undefined);

      await controller.handleTicketImport(ticketData, mockRmqContext);

      expect(mockChannel.ack).toHaveBeenCalledTimes(1);
    });
  });
});
