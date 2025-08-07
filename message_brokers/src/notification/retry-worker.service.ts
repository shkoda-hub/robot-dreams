import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { lastValueFrom, retry, timeout } from 'rxjs';
import { RedisStreamEntry, RedisStreamKey } from '../types/redis';
import { KafkaTopic } from '../types/kafka';

@Injectable()
export class RetryWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(RetryWorkerService.name);
  private running = true;
  private readonly consumerName = 'retry-worker';

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly producer: ClientKafka,
    private readonly redisService: RedisService,
  ) {}

  onModuleDestroy() {
    this.running = false;
  }
  async onModuleInit() {
    this.logger.log('Starting RetryWorkerService');
    await this.redisService.ensureXGroup(
      RedisStreamKey.NOTIFICATIONS_STREAM,
      RedisStreamKey.NOTIFICATIONS_GROUP,
    );
    this.loop().catch((error) =>
      this.logger.error(`Error while starting retry worker`, error),
    );
  }

  async loop() {
    while (this.running) {
      const batch = await this.redisService.xreadgroup(
        RedisStreamKey.NOTIFICATIONS_GROUP,
        this.consumerName,
        20,
        10000,
        [RedisStreamKey.NOTIFICATIONS_STREAM, '>'],
      );

      if (batch) {
        const entries = batch[0][1];
        await this.processRetryBatch(entries);
      }

      const [, pendings] = await this.redisService.xutoclaim(
        RedisStreamKey.NOTIFICATIONS_STREAM,
        RedisStreamKey.NOTIFICATIONS_GROUP,
        this.consumerName,
        30_000,
        '0',
        20,
      );

      if (pendings.length) {
        await this.processRetryBatch(pendings);
      }
    }
  }

  async processRetryBatch(batch: RedisStreamEntry<string[]>[]) {
    for (const [id, fields] of batch) {
      const message = fields[1];

      try {
        await lastValueFrom(
          this.producer
            .emit(KafkaTopic.NOTIFICATIONS, message)
            .pipe(timeout(3000), retry({ count: 3, delay: 2000 })),
        );

        await this.redisService.xack(
          RedisStreamKey.NOTIFICATIONS_STREAM,
          RedisStreamKey.NOTIFICATIONS_GROUP,
          id,
        );

        await this.redisService.xdel(RedisStreamKey.NOTIFICATIONS_STREAM, id);
      } catch (error) {
        this.logger.error(`Error while processing retryBatch`, error);
      }
    }
  }
}
