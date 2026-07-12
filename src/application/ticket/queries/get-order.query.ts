import { IQuery } from '@nestjs/cqrs';
import { Order } from '@/domain/entities/order';

export class GetOrderQuery implements IQuery {
  constructor(
    public readonly orderId: string,
  ) {}
}
