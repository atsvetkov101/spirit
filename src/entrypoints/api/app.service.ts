import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from Spirit API!';
  }

  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}