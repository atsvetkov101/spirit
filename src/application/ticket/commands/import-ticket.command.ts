import { ICommand } from '@nestjs/cqrs';
import { TicketImportDto } from '@/contracts/consumer/ticket-import.dto';

export class ImportTicketCommand implements ICommand {
  constructor(
    public readonly data: TicketImportDto,
  ) {}
}
