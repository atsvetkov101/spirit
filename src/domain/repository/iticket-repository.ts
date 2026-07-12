import { TicketEntity } from '@/domain/entities/ticket-entity';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface ITicketRepository {
  findById(id: string): Promise<TicketEntity | null>;
  findAll(): Promise<TicketEntity[]>;
  save(aggregate: TicketEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
