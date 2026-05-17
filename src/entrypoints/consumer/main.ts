import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  // Create a microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConsumerModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: process.env.RABBITMQ_QUEUE || 'default_queue',
        queueOptions: {
          durable: true,
        },
        // Enable automatic acknowledgment (optional)
        noAck: false,
        prefetchCount: 1,
      },
    },
  );

  await app.listen();
  console.log('Consumer microservice is listening on RabbitMQ queue');
}

bootstrap();