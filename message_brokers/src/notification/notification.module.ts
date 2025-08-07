import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '../redis/redis.module';
import { RetryWorkerService } from './retry-worker.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'my-app',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'my-app-signup-logger-group',
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          producerOnlyMode: true,
        },
      },
    ]),
    RedisModule,
  ],
  providers: [NotificationService, RetryWorkerService],
  controllers: [NotificationController],
})
export class NotificationModule {}
