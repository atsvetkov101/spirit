import { Global, Module } from '@nestjs/common';
import { CqrsModule, CommandBus, QueryBus } from '@nestjs/cqrs';
import { ConfirmOrderHandler } from './order/commands/confirm-order.handler';
import { ChangeStatusHandler } from './ticket/commands/change-status.handler';
import { ImportTicketHandler } from './ticket/commands/import-ticket.handler';
import { GetTicketHandler } from './ticket/queries/get-ticket.handler';
import { GetOrderHandler } from './ticket/queries/get-order.handler';
import { TicketDomainService } from '@/domain/domain-services/ticket-domain-service';
import { TicketRepository } from '@/infrastructure/repository/ticket-repository';
import { OrderRepository } from '@/infrastructure/repository/order-repository';
import { ServiceObjectRepository } from '@/infrastructure/repository/service-object-repository';
import { EventBusModule } from '@/infrastructure/event-emitter/event-bus.module';
import { SendEmailOnOrderConfirmedHandler } from '@/application/order/confirm-order/send-email-on-order-confirmed-handler';
import { INotificationService } from '@/application/order/ports/inotification-service';
import { ORDER_REPOSITORY } from '@/domain/repository/iorder-repository';
import { TICKET_REPOSITORY } from '@/domain/repository/iticket-repository';
import { SERVICE_OBJECT_REPOSITORY } from '@/domain/repository/iservice-object-repository';
import { EVENT_BUS } from '@/domain/shared/ievent-bus';

const CommandHandlers = [
  ConfirmOrderHandler,
  ChangeStatusHandler,
  ImportTicketHandler,
];

const QueryHandlers = [
  GetTicketHandler,
  GetOrderHandler,
];

@Global()
@Module({
  imports: [CqrsModule.forRoot()],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    TicketDomainService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: TICKET_REPOSITORY,
      useClass: TicketRepository,
    },
    {
      provide: SERVICE_OBJECT_REPOSITORY,
      useClass: ServiceObjectRepository,
    },
    {
      provide: EVENT_BUS,
      useFactory: () => {
        const notificationService: INotificationService = {
          sendEmail: async (to: string, subject: string, body: string) => {
            console.log(`[NotificationService] Email sent to ${to}: ${subject}`);
          },
        };
        const sendEmailHandler = new SendEmailOnOrderConfirmedHandler(notificationService);
        return new EventBusModule(sendEmailHandler);
      },
    },
  ],
  exports: [CqrsModule],
})
export class AppCqrsModule {}
