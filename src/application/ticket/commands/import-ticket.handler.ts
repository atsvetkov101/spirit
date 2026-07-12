import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { ImportTicketCommand } from './import-ticket.command';
import { TicketEntity } from '@/domain/entities/ticket-entity';
import { ServiceObjectEntity } from '@/domain/entities/service-object-entity';
import { ITicketRepository, TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { IServiceObjectRepository, SERVICE_OBJECT_REPOSITORY } from '@/domain/repository/iservice-object-repository';

@CommandHandler(ImportTicketCommand)
export class ImportTicketHandler implements ICommandHandler<ImportTicketCommand> {
  private readonly logger = new Logger(ImportTicketHandler.name);

  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepository: ITicketRepository,
    @Inject(SERVICE_OBJECT_REPOSITORY) private readonly serviceObjectRepository: IServiceObjectRepository,
  ) {}

  async execute(command: ImportTicketCommand): Promise<{ ticketId: string; serviceObjectId: string }> {
    const { data } = command;

    this.logger.log(`Importing ticket: ${JSON.stringify(data)}`);

    const ticket = TicketEntity.fromDto(data);
    await this.ticketRepository.save(ticket);
    const ticketId = ticket.getId();

    const serviceObjectDto = data.service_object;
    const serviceObject = ServiceObjectEntity.fromDto(serviceObjectDto, ticketId);
    await this.serviceObjectRepository.save(serviceObject);
    const serviceObjectId = serviceObject.getId()!;

    this.logger.log(`Ticket saved successfully with ID: ${ticketId}`);
    this.logger.log(`ServiceObject saved successfully with ID: ${serviceObjectId}`);

    return { ticketId, serviceObjectId };
  }
}
