import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChangeStatusDto } from '@/application/dtos/change-status-dto';
import { TicketAppService } from '@/application/services/ticket-app-service';
import { ChangeStatusMapper } from '@/application/mappers/change-status-mapper';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly ticketAppService: TicketAppService) {}

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

    const ticketUpdateData = ChangeStatusMapper.toUpdateData(data);
    const checkListUserData = ChangeStatusMapper.toCheckListUserData(data);
    const res = this.ticketAppService.changeStatus(data.ticketId, ticketUpdateData, checkListUserData);

    return { status: 'ok' };
  }



}
