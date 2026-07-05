import { ICommand } from '@nestjs/cqrs';

export class ConfirmOrderCommand implements ICommand {
  constructor(
    public readonly orderId: string,
  ) {}
}
