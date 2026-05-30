import { Module, OnModuleInit } from '@nestjs/common';
import { ConsumerService, TICKET_REPOSITORY, SERVICE_OBJECT_REPOSITORY } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { syncDatabase } from '../../database';
import { TicketRepository } from '@/infrastructure/repository/ticket-repository';
import { ServiceObjectRepository } from '@/infrastructure/repository/service-object-repository';

@Module({
  imports: [],
  controllers: [ConsumerController],
  providers: [
    ConsumerService,
    {
      provide: TICKET_REPOSITORY,
      useClass: TicketRepository,
    },
    {
      provide: SERVICE_OBJECT_REPOSITORY,
      useClass: ServiceObjectRepository,
    },
  ],
})
export class ConsumerModule implements OnModuleInit {
  async onModuleInit() {
    // Синхронизация базы данных при старте модуля
    await syncDatabase();
  }
}