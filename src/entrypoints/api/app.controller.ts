import { Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChangeStatusDto } from '@/application/dtos/change-status-dto';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  changeStatus(@Param() param: ChangeStatusDto) {
    return { status: 'ok' };
  }



}
