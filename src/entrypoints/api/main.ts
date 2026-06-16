import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebServerExceptionsFilter } from '@/filters/web-server-exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.useGlobalFilters(new WebServerExceptionsFilter());
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
