import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TicketAppService } from '@/application/services/ticket-app-service';
import { TicketDomainService } from '@/domain/domain-services/ticket-domain-service';
import { TicketRepository } from '@/infrastructure/repository/ticket-repository';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, TicketAppService, TicketDomainService, TicketRepository],
})
export class AppModule {}
