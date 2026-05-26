import { TicketEntity } from '@/domain/entities/ticket-entity';
import { Ticket, TicketCreationAttributes } from '@/models/ticket.model';
import { Transaction } from 'sequelize';
import { ITicketRepository } from '@/domain/interfaces/iticket-repository';

export class TicketRepository implements ITicketRepository {
  async save(aggregate: TicketEntity, transaction: Transaction | null = null): Promise<void> {
    const ticketData: TicketCreationAttributes = {
      id: aggregate.getId(),
      consumer_id: aggregate.getConsumerId(),
      consumer_email: aggregate.getConsumerEmail().getValue(),
      assignee_id: aggregate.getAssigneeId(),
      status: aggregate.getStatus(),
      service: aggregate.getService(),
      created_by: aggregate.getCreatedBy(),
      created_time: new Date(aggregate.getCreatedTime()),
      deadline: new Date(aggregate.getDeadline()),
      act_type: aggregate.getActType(),
      wiki_link: aggregate.getWikiLink(),
      is_service_change_available: aggregate.isServiceChangeAvailable(),
    };

    await Ticket.upsert(ticketData, { transaction });
  }

  async findById(id: string): Promise<TicketEntity | null> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }

  async findAll(): Promise<TicketEntity[]> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    // TODO: Implement
    throw new Error('Method not implemented.');
  }
}