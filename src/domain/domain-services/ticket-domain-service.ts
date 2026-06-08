import { TicketEntity } from "@/domain/entities/ticket-entity";
import { TicketUpdateData } from "../vo/ticket-update-data";
import { CheckListFactory } from "../factories/check-list-factory";
import { CheckList } from "../entities/check-list";
import { CheckListUserData } from "../vo/check-list-user-data";
import { ChangeStatusResult } from "./change-status-result";


export class TicketDomainService {

    public async changeStatus(ticket: TicketEntity, newData: TicketUpdateData, checkListUserData: CheckListUserData) {

        if(ticket.statusChangeAllowed(newData.status)) {
          throw new Error('Такое изменение статуса не поддерживается');
        }
        // Если тикет закрывается, то создаем чек-лист, чтобы его сохранить
        let checkList: CheckList|undefined;
        if(ticket.isClosing(newData.status)) {
            checkList = CheckListFactory.createByUserData(checkListUserData);
        }
        ticket.applyChangeStatusChanges(newData);

        return new ChangeStatusResult(ticket, checkList);
    }
}
