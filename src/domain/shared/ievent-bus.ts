import { IDomainEvent } from "./idomain-event";

export const EVENT_BUS = Symbol('EVENT_BUS');

export interface IEventBus {
  /**
   * Публикует одно доменное событие
   */
  publish(event: IDomainEvent): Promise<void>;

  /**
   * Публикует массив доменных событий (полезно при сохранении агрегата)
   */
  publishAll(events: IDomainEvent[]): Promise<void>;
}
