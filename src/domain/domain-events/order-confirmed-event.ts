import { DomainEvent } from "./domain-event";

type OrderConfirmedInfo = {
 orderId: string,
 eventId?: string,
 occurredAt?: Date
};

export class OrderConfirmedEvent extends DomainEvent {
  private readonly orderId: string;
  constructor(data: OrderConfirmedInfo) {
    super(data.eventId, data.occurredAt);
    this.orderId = data.orderId;
  }
  getOrderId() {
    return this.orderId;
  }
}
