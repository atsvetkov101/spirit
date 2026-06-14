import { Email } from "./email";
import TicketStatus from "./ticket-status";
/*
 * Класс для хранения данных для обновления тикета
 */
export class TicketUpdateData{
    status!: TicketStatus;
    service?: string;
    constructor(status: TicketStatus, service?: string){
        this.status = status;
        this.service = service;
    }
    setStatus(status: TicketStatus){
      this.status = status;
      return this;
    }
    setService(service: string){
        this.service = service;
        return this;
    }
}
