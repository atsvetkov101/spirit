import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { ConsumerService } from './consumer.service';
import { TicketImportDto } from '../../contracts/consumer/ticket-import.dto';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'consumer' };
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.consumerService.handleUserCreated(data);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  @EventPattern('order_placed')
  handleOrderPlaced(@Payload() data: any, @Ctx() context: RmqContext) {
    this.consumerService.handleOrderPlaced(data);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  @EventPattern('ticket_import')
  async handleTicketImport(@Payload() data: TicketImportDto, @Ctx() context: RmqContext) {
    await this.consumerService.handleTicketImport(data);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}