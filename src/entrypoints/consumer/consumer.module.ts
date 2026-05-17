import { Module, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { syncDatabase } from '../../database';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule implements OnModuleInit {
  async onModuleInit() {
    // Синхронизация базы данных при старте модуля
    await syncDatabase();
  }
}