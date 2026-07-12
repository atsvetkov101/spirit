import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetOrderQuery } from './get-order.query';
import { IOrderRepository, ORDER_REPOSITORY } from '@/domain/repository/iorder-repository';
import { Order } from '@/domain/entities/order';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(query: GetOrderQuery): Promise<Order | null> {
    const { orderId } = query;
    return this.orderRepository.getById(orderId);
  }
}
