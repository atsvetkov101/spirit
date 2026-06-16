import { CheckList } from "../entities/check-list";
import { TicketEntity } from "../entities/ticket-entity";

export class ChangeStatusResult {
    ticket: TicketEntity;
    checkList?: CheckList;
    constructor(ticket: TicketEntity, checkList: CheckList | undefined = undefined) {
      this.ticket = ticket,
      this.checkList = checkList;
    }

};
