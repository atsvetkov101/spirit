import { OrderConfirmedEvent } from "../../../domain/domain-events/order-confirmed-event";
import { INotificationService } from "../ports/inotification-service";

export class SendEmailOnOrderConfirmedHandler {
  constructor(private readonly notificationService: INotificationService) {} // Например, Email-сервис

  async handle(event: OrderConfirmedEvent): Promise<void> {
    const orderId = event.getOrderId();
    console.log(`[Application] Нотификация: Заказ ${orderId} подтвержден`);

    // TODO: Получить email клиента по заказу
    const customerEmail = 'test@test.ru';

    // Логика отправки email
    this.notificationService.sendEmail(
      customerEmail,
      'Заказ подтвержден',
      `Заказ ${orderId} подтвержден`,
    );
  }
}
