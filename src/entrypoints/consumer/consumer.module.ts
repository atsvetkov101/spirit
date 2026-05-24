import { Module, OnModuleInit } from '@nestjs/common';
import { ConsumerService, TICKET_REPOSITORY } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { syncDatabase } from '../../database';
import { TicketRepository } from '@/infrastructure/ticket-repository';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [
    ConsumerService,
    {
      provide: TICKET_REPOSITORY,
      useClass: TicketRepository,
    },
  ],
})
export class ConsumerModule implements OnModuleInit {
  async onModuleInit() {
    // Синхронизация базы данных при старте модуля
    await syncDatabase();
  }
}