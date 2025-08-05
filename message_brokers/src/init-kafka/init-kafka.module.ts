import { Module } from '@nestjs/common';
import { InitKafkaService } from './init-kafka.service';

@Module({
  providers: [InitKafkaService],
  exports: [InitKafkaService],
})
export class InitKafkaModule {}
