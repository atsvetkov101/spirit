import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { syncDatabase } from '../../infrastructure/database/database';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TicketAppService } from '@/application/services/ticket-app-service';
import { TicketDomainService } from '@/domain/domain-services/ticket-domain-service';
import { TicketRepository } from '@/infrastructure/repository/ticket-repository';
import { OrderLineModel } from '@/infrastructure/database/models/order-line.model';
import { OrderModel } from '@/infrastructure/database/models/order.model';
import { ProductModel } from '@/infrastructure/database/models/product.model';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, TicketAppService, TicketDomainService, TicketRepository,
    OrderLineModel, OrderModel, ProductModel],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    // Синхронизация базы данных при старте модуля
    await syncDatabase();
  }
}
