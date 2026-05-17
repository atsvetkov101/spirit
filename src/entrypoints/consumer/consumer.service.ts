import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);

  handleUserCreated(data: any) {
    this.logger.log(`Received user_created event: ${JSON.stringify(data)}`);
    // Business logic here
  }

  handleOrderPlaced(data: any) {
    this.logger.log(`Received order_placed event: ${JSON.stringify(data)}`);
    // Business logic here
  }

  // Add more event handlers as needed
}