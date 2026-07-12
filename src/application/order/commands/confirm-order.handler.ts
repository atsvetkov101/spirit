import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ConfirmOrderCommand } from './confirm-order.command';
import { IOrderRepository, ORDER_REPOSITORY } from '@/domain/repository/iorder-repository';
import { IEventBus, EVENT_BUS } from '@/domain/shared/ievent-bus';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
    @Inject(EVENT_BUS) private readonly eventBus: IEventBus,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<void> {
    const { orderId } = command;

    const order = await this.orderRepository.getById(orderId);
    if (!order) {
      throw new Error('Заказ не найден');
    }

    order.confirm();

    await this.orderRepository.save(order);

    const events = order.getDomainEvents();
    if (events.length > 0) {
      await this.eventBus.publishAll(events as any);
    }

    order.сlearDomainEvents();
  }
}
