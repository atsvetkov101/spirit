import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTicketQuery } from './get-ticket.query';
import { ITicketRepository, TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { TicketEntity } from '@/domain/entities/ticket-entity';

@QueryHandler(GetTicketQuery)
export class GetTicketHandler implements IQueryHandler<GetTicketQuery> {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(query: GetTicketQuery): Promise<TicketEntity | null> {
    const { ticketId } = query;
    return this.ticketRepository.findById(ticketId);
  }
}
