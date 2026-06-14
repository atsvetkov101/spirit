import { TicketEntity } from "@/domain/entities/ticket-entity";
import { TicketUpdateData } from "../vo/ticket-update-data";
import { CheckListFactory } from "../factories/check-list-factory";
import { CheckList } from "../entities/check-list";
import { CheckListUserData } from "../vo/check-list-user-data";
import { ChangeStatusResult } from "./change-status-result";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TicketDomainService {

    public async changeStatus(ticket: TicketEntity, newData: TicketUpdateData, checkListUserData: CheckListUserData | undefined) {

        if(ticket.statusChangeAllowed(newData.status)) {
          throw new Error('Такое изменение статуса не поддерживается');
        }
        // Если тикет закрывается, то создаем чек-лист, чтобы его сохранить
        let checkList: CheckList|undefined;
        if(ticket.isClosing(newData.status)) {
            if(!checkListUserData) {
                throw new Error('Для закрытия тикета нужно указать чек-лист');
            }
            checkList = CheckListFactory.createByUserData(checkListUserData);
        }
        ticket.applyChangeStatusChanges(newData);

        return new ChangeStatusResult(ticket, checkList);
    }
}
