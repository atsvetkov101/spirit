import { ChangeStatusDto } from "@/application/dtos/change-status-dto";
import { ChangeStatusTicketUpdateData } from "@/application/services/ticket-app-service/dtos/change-status-ticket-update-data";
import { ChangeStatusCheckListUserData } from "@/application/services/ticket-app-service/dtos/change-status-check-list-user-data";
import { TicketUpdateData } from "@/domain/vo/ticket-update-data";
import TicketStatus from "@/domain/vo/ticket-status";
import { CheckListUserData } from "@/domain/vo/check-list-user-data";

export class ChangeStatusMapper {
  static toUpdateData(dto: ChangeStatusDto): ChangeStatusTicketUpdateData {
    return {
      id: dto.ticketId,
      status: 'closed', // по умолчанию закрываем тикет
      service: dto.serviceId
    };
  }

  static toDomainTicketUpdateData(data: ChangeStatusTicketUpdateData): TicketUpdateData {
    const status = data.status as TicketStatus;
    return new TicketUpdateData(status, data.service);
  }

  static toCheckListUserData(dto: ChangeStatusDto): ChangeStatusCheckListUserData | undefined {
    if (!dto.checkList || !dto.checkList.works) {
      return undefined;
    }

    return {
      works: dto.checkList.works.map(work => ({
        id: work.id,
        action: work.action,
        actionData: work.actionData
      }))
    };
  }

  static toDomainCheckListUserData(data: ChangeStatusCheckListUserData | undefined): CheckListUserData | undefined {
    if (!data || !data.works) {
      return undefined;
    }

    return new CheckListUserData(
      data.works.map(work => ({
        id: work.id,
        action: work.action,
        actionData: work.actionData
      }))
    );
  }
}
