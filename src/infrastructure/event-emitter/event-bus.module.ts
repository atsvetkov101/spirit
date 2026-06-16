import { EventEmitter } from 'events';
// Импорт интерфейса шины (из Domain или Application)
import { IEventBus } from '@/domain/shared/ievent-bus';
// Импорт события (из Domain)
import { OrderConfirmedEvent } from '@/domain/domain-events/order-confirmed-event';
// Импорт обработчика (из Application)
import { SendEmailOnOrderConfirmedHandler } from '@/application/order/confirm-order/send-email-on-order-confirmed-handler';
import { IDomainEvent } from '@/domain/shared/idomain-event';


export class EventBusModule implements IEventBus {
  private emitter: EventEmitter;

  constructor(
    // Зависимости для обработчиков передаются через конструктор (DI)
    private sendEmailHandler: SendEmailOnOrderConfirmedHandler
  ) {
    this.emitter = new EventEmitter();
    this.registerSubscriptions();
  }

  /**
   * Метод публикации событий (вызывается в Use Cases или репозиториях)
   */
  public async publish(event: IDomainEvent): Promise<void> {
    // Используем имя класса события в качестве названия топика/канала
    const eventName = event.constructor.name;
    this.emitter.emit(eventName, event);
    return Promise.resolve();
  }

  public async publishAll(events: IDomainEvent[]): Promise<void> {
    events.forEach(event => {
      this.publish(event);
    });
    return Promise.resolve();
  }

  /**
   * ТОЧКА ПОДПИСКИ (Регистрация связей между событиями и обработчиками)
   * Этот метод изолирует инфраструктуру от бизнес-логики.
   */
  private registerSubscriptions(): void {

    // Подписка: При возникновении OrderConfirmedEvent вызвать обработчик
    this.emitter.on(OrderConfirmedEvent.name, async (event: OrderConfirmedEvent) => {
      try {
        await this.sendEmailHandler.handle(event);
      } catch (error) {
        // Централизованное логирование ошибок в инфраструктурном слое
        console.error(`[EventBus] Error handling ${OrderConfirmedEvent.name}:`, error);
      }
    });


  }
}
