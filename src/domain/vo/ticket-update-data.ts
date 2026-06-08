import { Email } from "./email";
import TicketStatus from "./ticket-status";
/*
 * Класс для хранения данных для обновления тикета
 */
export class TicketUpdateData{
    status!: TicketStatus;
    service?: string;
}
