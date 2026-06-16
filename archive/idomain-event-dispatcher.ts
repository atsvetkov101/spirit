// C:\gh\spirit\src\application\dispatcher\idomain-event-dispatcher.ts
import { DomainEvent } from "@/domain/domain-events/domain-event";

export interface IDomainEventDispatcher {
    dispatch(events: DomainEvent[]): Promise<void>;
}
