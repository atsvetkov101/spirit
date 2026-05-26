import { TicketEntity } from '@/core/entities/ticket-entity';

export interface ITicketRepository {
  findById(id: string): Promise<TicketEntity | null>;
  findAll(): Promise<TicketEntity[]>;
  save(aggregate: TicketEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
