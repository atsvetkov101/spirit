import { DomainEvent } from "./domain-event";
import TicketStatus from "../vo/ticket-status";

type TicketStatusChangedInfo = {
 ticketId: string,
 newStatus: TicketStatus,
 eventId?: string,
 occurredAt?: Date
};

export class TicketStatusChangedEvent extends DomainEvent {
  private ticketId: string;
  private newStatus: TicketStatus;

  constructor(data: TicketStatusChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newStatus = data.newStatus;
  }
}
