//C:\gh\spirit\src\application\order\confirm-order\confirm-order-handler.ts
import { IDomainEventDispatcher } from "@/application/dispatcher/idomain-event-dispatcher";
import { Order } from "@/domain/entities/order";
import { IOrderRepository } from "@/domain/repository/iorder-repository";
import { OrderRepository } from "@/infrastructure/repository/order-repository";

export class {
    public ConfirmOrderHandler(
        private readonly orderRepository: IOrderRepository,
        private readonly dispatcher: IDomainEventDispatcher)
    {
    }

    public async Handle(ConfirmOrderCommand command): Promise<void>
    {
        const order: Order = this.orderRepository.getById(command.OrderId);
        if (order == null) {
          throw new Error("Заказ не найден");
        }

        order.сonfirm();

        await this.orderRepository.save(order);

        await this.dispatcher.dispatch(order.getDomainEvents());

        order.clearDomainEvents();
    }
}
