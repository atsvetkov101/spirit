import { Injectable, Logger, Inject } from '@nestjs/common';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { ServiceObjectImportDto } from '../../contracts/consumer/service-object-import.dto';
import { TicketEntity } from '@/domain/entities/ticket-entity';
import { ServiceObjectEntity } from '@/domain/entities/service-object-entity';
import { ITicketRepository } from '@/domain/interfaces/iticket-repository';
import { IServiceObjectRepository } from '@/domain/interfaces/iservice-object-repository';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');
export const SERVICE_OBJECT_REPOSITORY = Symbol('SERVICE_OBJECT_REPOSITORY');

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
    @Inject(SERVICE_OBJECT_REPOSITORY)
    private readonly serviceObjectRepository: IServiceObjectRepository,
  ) {}

  handleUserCreated(data: any) {
    this.logger.log(`Received user_created event: ${JSON.stringify(data)}`);
    // Business logic here
  }

  handleOrderPlaced(data: any) {
    this.logger.log(`Received order_placed event: ${JSON.stringify(data)}`);
    // Business logic here
  }
  
  async handleTicketImport(data: TicketImportDto) {
    this.logger.log(`Received ticket-import event: ${JSON.stringify(data)}`);
    
    try {
      // Сохранение тикета через репозиторий
      const ticket = TicketEntity.fromDto(data);
      await this.ticketRepository.save(ticket);
      const ticketId = ticket.getId();
      
      const serviceObjectDto: ServiceObjectImportDto = data.service_object;
      const serviceObject = ServiceObjectEntity.fromDto(serviceObjectDto, ticketId);
      await this.serviceObjectRepository.save(serviceObject);
      const serviceObjectId = serviceObject.getId();

      this.logger.log(`Ticket saved successfully with ID: ${ticketId}`);
      this.logger.log(`ServiceObject saved successfully with ID: ${serviceObjectId}`);
      
      return { ticketId, serviceObjectId };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to save ticket: ${err.message}`, err.stack);
      throw error;
    }
  }

  // Add more event handlers as needed
}