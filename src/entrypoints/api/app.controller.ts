import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AppService } from './app.service';
import { ChangeStatusDto } from '@/application/dtos/change-status-dto';
import { ChangeStatusCommand } from '@/application/ticket/commands/change-status.command';
import { ChangeStatusMapper } from '@/application/mappers/change-status-mapper';
import { ConfirmOrderCommand } from '@/application/order/commands/confirm-order.command';

const logger = console;
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string } {
    return this.appService.getHealth();
  }

  @HttpCode(HttpStatus.OK)
  @Post('api/mobile/v1/change-status')
  async changeStatus(@Body() data: ChangeStatusDto) {
    try {
      const ticketUpdateData = ChangeStatusMapper.toUpdateData(data);
      const checkListUserData = ChangeStatusMapper.toCheckListUserData(data);

      const command = new ChangeStatusCommand(
        data.ticketId,
        ticketUpdateData,
        checkListUserData,
      );

      await this.commandBus.execute(command);
    } catch (error: any) {
      logger.log(`ERROR: ${error.message}`)
      return { status: 'error', message: error.message };
    }
    return { status: 'ok' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('api/mobile/v1/confirm-order')
  async confirmOrder(@Body() data: { orderId: string }) {
    try {
      const command = new ConfirmOrderCommand(data.orderId);
      await this.commandBus.execute(command);
    } catch (error: any) {
      logger.log(`ERROR: ${error.message}`)
      return { status: 'error', message: error.message };
    }
    return { status: 'ok' };
  }
}
