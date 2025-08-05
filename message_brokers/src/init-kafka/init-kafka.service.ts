import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class InitKafkaService implements OnModuleInit {
  private readonly logger: Logger = new Logger(InitKafkaService.name);

  async onModuleInit() {
    this.logger.log('Initializing Kafka topics');
    const kafka = new Kafka({
      brokers: ['kafka:9092'],
      clientId: 'my-app',
    });
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    if (!existingTopics.includes('events.notifications')) {
      await admin.createTopics({
        topics: [
          {
            topic: 'events.notifications',
            numPartitions: 3,
            replicationFactor: 1,
          },
        ],
      });
    }
    await admin.disconnect();
    this.logger.log('Kafka topics have been initialized successfully.');
  }
}
