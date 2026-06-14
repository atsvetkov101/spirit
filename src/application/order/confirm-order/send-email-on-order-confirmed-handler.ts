import { OrderConfirmedEvent } from "../../../domain/domain-events/order-confirmed-event";

export class SendEmailOnOrderConfirmedHandler {
  constructor(private notificationService: any) {} // Например, Email-сервис

  async handle(event: OrderConfirmedEvent): Promise<void> {
    const orderId = event.getOrderId();
    console.log(`[Application] Нотификация: Заказ ${orderId} подтвержден`);

    // TODO: Получить email клиента по заказу
    const customerEmail = 'test@test.ru';

    // Логика отправки email
    // ... notificationService.sendEmail(...);
  }
}
