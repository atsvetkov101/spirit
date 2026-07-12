/// <reference types="jest" />
/// <reference types="node" />

import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { RmqContext } from '@nestjs/microservices';
import { CqrsModule, CommandBus } from '@nestjs/cqrs';
import { ImportTicketCommand } from '@/application/ticket/commands/import-ticket.command';
import { ImportTicketHandler } from '@/application/ticket/commands/import-ticket.handler';
import { TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { SERVICE_OBJECT_REPOSITORY } from '@/domain/repository/iservice-object-repository';
import { ITicketRepository } from '@/domain/repository/iticket-repository';
import { IServiceObjectRepository } from '@/domain/repository/iservice-object-repository';
import { TicketEntity } from '@/domain/entities/ticket-entity';
import { ServiceObjectEntity } from '@/domain/entities/service-object-entity';

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

    it.skip('должен вызывать методы save у TicketRepository и ServiceObjectRepository с корректными данными', async () => {
      // Сбросим моки
      jest.clearAllMocks();

      const ticketData = createTicketData();

      // Моки для репозиториев
      const mockTicketRepository: jest.Mocked<ITicketRepository> = {
        save: jest.fn().mockResolvedValue(undefined),
        findById: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
      };

      const mockServiceObjectRepository: jest.Mocked<IServiceObjectRepository> = {
        save: jest.fn().mockResolvedValue(undefined),
        findById: jest.fn(),
        findAll: jest.fn(),
        delete: jest.fn(),
      };

      // Создаем мок RmqContext
      const mockChannel = { ack: jest.fn() };
      const mockMessage = {};
      const mockRmqContext = {
        getChannelRef: jest.fn(() => mockChannel),
        getMessage: jest.fn(() => mockMessage),
      } as unknown as jest.Mocked<RmqContext>;

      // Мок для ConsumerService (нужен только как зависимость контроллера)
      const mockConsumerService = {
        handleUserCreated: jest.fn(),
        handleOrderPlaced: jest.fn(),
      };

      // Создаем модуль с CqrsModule и ImportTicketHandler напрямую
      const testingModule: TestingModule = await Test.createTestingModule({
        imports: [CqrsModule],
        controllers: [ConsumerController],
        providers: [
          {
            provide: ConsumerService,
            useValue: mockConsumerService,
          },
          ImportTicketHandler,
          {
            provide: TICKET_REPOSITORY,
            useValue: mockTicketRepository,
          },
          {
            provide: SERVICE_OBJECT_REPOSITORY,
            useValue: mockServiceObjectRepository,
          },
        ],
      }).compile();

      const realConsumerController = testingModule.get<ConsumerController>(ConsumerController);

      // Вызываем метод контроллера
      await realConsumerController.handleTicketImport(ticketData, mockRmqContext);

      // Проверяем вызов TicketRepository.save с корректными данными
      expect(mockTicketRepository.save).toHaveBeenCalledTimes(1);
      const savedTicket = (mockTicketRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedTicket).toBeInstanceOf(TicketEntity);
      expect(savedTicket.getId()).toBe(ticketData.id);
      expect(savedTicket.getConsumerId()).toBe(ticketData.consumer_id);
      expect(savedTicket.getConsumerEmail().getValue()).toBe(ticketData.consumer_email);

      // Проверяем вызов ServiceObjectRepository.save с корректными данными
      expect(mockServiceObjectRepository.save).toHaveBeenCalledTimes(1);
      const savedServiceObject = (mockServiceObjectRepository.save as jest.Mock).mock.calls[0][0];
      expect(savedServiceObject).toBeInstanceOf(ServiceObjectEntity);
      expect(savedServiceObject.getAddress()).toBe(ticketData.service_object.address);
      expect(savedServiceObject.getTicketId()).toBe(ticketData.id);

      // Проверяем, что ack был вызван
      expect(mockRmqContext.getChannelRef).toHaveBeenCalled();
      expect(mockRmqContext.getMessage).toHaveBeenCalled();
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMessage);
    });
  });
});
