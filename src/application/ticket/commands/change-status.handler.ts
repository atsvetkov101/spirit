import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ChangeStatusCommand } from './change-status.command';
import { TicketDomainService } from '@/domain/domain-services/ticket-domain-service';
import { ITicketRepository, TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { IEventBus, EVENT_BUS } from '@/domain/shared/ievent-bus';
import { ChangeStatusMapper } from '../../mappers/change-status-mapper';
import { TicketUpdateData } from '@/domain/vo/ticket-update-data';
import { CheckListUserData } from '@/domain/vo/check-list-user-data';

@CommandHandler(ChangeStatusCommand)
export class ChangeStatusHandler implements ICommandHandler<ChangeStatusCommand> {
  constructor(
    private readonly ticketDomainService: TicketDomainService,
    @Inject(TICKET_REPOSITORY) private readonly ticketRepository: ITicketRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
  ) {}

  async execute(command: ChangeStatusCommand): Promise<string> {
    const { ticketId, ticketUpdateData, checkListUserData } = command;

    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new Error('Такого тикета не существует');
    }

    const newData: TicketUpdateData = ChangeStatusMapper.toDomainTicketUpdateData(ticketUpdateData);
    const domainCheckListUserData: CheckListUserData | undefined =
      ChangeStatusMapper.toDomainCheckListUserData(checkListUserData);

    const res = await this.ticketDomainService.changeStatus(ticket, newData, domainCheckListUserData);

    await this.ticketRepository.save(ticket);

    const events = ticket.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publishAll(events as any);
    }

    return res.ticket.getId();
  }
}
