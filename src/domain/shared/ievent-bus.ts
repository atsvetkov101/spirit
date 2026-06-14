import { IDomainEvent } from "./idomain-event";

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
