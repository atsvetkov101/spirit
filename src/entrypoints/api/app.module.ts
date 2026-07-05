import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { syncDatabase } from '../../infrastructure/database/database';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppCqrsModule } from '@/application/cqrs.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AppCqrsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    // Синхронизация базы данных при старте модуля
    await syncDatabase();
  }
}
