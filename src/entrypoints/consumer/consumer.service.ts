import { Injectable, Logger } from '@nestjs/common';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';
import { Ticket, TicketCreationAttributes } from '../../models/ticket.model';
import { ServiceObject, ServiceObjectCreationAttributes } from '../../models/service-object.model';
import { sequelize } from '../../database';

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
      // Сохранение тикета и service_object в транзакции
      const result = await sequelize.transaction(async (transaction) => {
        // Создание тикета
        const ticketData: TicketCreationAttributes = {
          id: data.id,
          consumer_id: data.consumer_id,
          consumer_email: data.consumer_email,
          assignee_id: data.assignee_id,
          status: data.status,
          service: data.service,
          created_by: data.created_by,
          created_time: new Date(data.created_time),
          deadline: new Date(data.deadline),
          act_type: data.act_type,
          wiki_link: data.wiki_link,
          is_service_change_available: data.is_service_change_available,
        };

        const [ticket] = await Ticket.upsert(ticketData, { transaction });

        // Создание service_object
        const serviceObjectData: ServiceObjectCreationAttributes = {
          address: data.service_object.address,
          name: data.service_object.name,
          search_code: data.service_object.search_code,
          lat: data.service_object.coords.lat,
          lng: data.service_object.coords.lng,
          phone_number: data.service_object.phone_number,
          ticket_id: ticket.id,
        };

        const [serviceObject] = await ServiceObject.upsert(serviceObjectData, { transaction });

        return { ticket, serviceObject };
      });

      this.logger.log(`Ticket saved successfully with ID: ${result.ticket.id}`);
      this.logger.log(`ServiceObject saved successfully with ID: ${result.serviceObject.id}`);
      
      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to save ticket: ${err.message}`, err.stack);
      throw error;
    }
  }

  // Add more event handlers as needed
}