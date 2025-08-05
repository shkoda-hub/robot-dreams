import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { NotificationModule } from './notification/notification.module';
import { InitKafkaModule } from './init-kafka/init-kafka.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [InitKafkaModule, LoggerModule, NotificationModule, RedisModule],
})
export class AppModule {}
