import { Injectable, Logger } from '@nestjs/common';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { ServiceObjectImportDto } from '../../contracts/consumer/service-object-import.dto';
import { sequelize } from '../../database';
import { TicketEntity } from '@/core/entities/ticket-entity';
import { ServiceObjectEntity } from '@/core/entities/service-object-entity';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

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
      // Сохранение тикета и service_object без транзакции
      const ticket = TicketEntity.fromDto(data);
      const ticketId = await ticket.save();
      
      const serviceObjectDto: ServiceObjectImportDto = data.service_object;
      const serviceObject = ServiceObjectEntity.fromDto(serviceObjectDto, ticketId);
      const serviceObjectId = await serviceObject.save();

      this.logger.log(`Ticket saved successfully with ID: ${ticket.getId()}`);
      this.logger.log(`ServiceObject saved successfully with ID: ${serviceObject.getId()}`);
      
      return { ticketId, serviceObjectId };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to save ticket: ${err.message}`, err.stack);
      throw error;
    }
  }

  // Add more event handlers as needed
}