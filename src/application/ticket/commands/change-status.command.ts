import { ICommand } from '@nestjs/cqrs';
import { ChangeStatusTicketUpdateData } from '../../services/ticket-app-service/dtos/change-status-ticket-update-data';
import { ChangeStatusCheckListUserData } from '../../services/ticket-app-service/dtos/change-status-check-list-user-data';

export class ChangeStatusCommand implements ICommand {
  constructor(
    public readonly ticketId: string,
    public readonly ticketUpdateData: ChangeStatusTicketUpdateData,
    public readonly checkListUserData?: ChangeStatusCheckListUserData,
  ) {}
}
