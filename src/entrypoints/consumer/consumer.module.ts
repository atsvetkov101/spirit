import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}