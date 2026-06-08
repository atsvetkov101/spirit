import { DomainEvent } from "./domain-event";
import TicketStatus from "../vo/ticket-status";

type TicketServiceChangedInfo = {
 ticketId: string,
 newService: string,
 eventId?: string,
 occurredAt?: Date
};

export class TicketServiceChangedEvent extends DomainEvent {
  private ticketId: string;
  private newService: string;

  constructor(data: TicketServiceChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newService = data.newService;
  }
}
