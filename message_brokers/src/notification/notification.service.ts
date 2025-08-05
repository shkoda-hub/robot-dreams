import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger: Logger = new Logger(NotificationService.name);
  private readonly stream = 'events.notifications';
  private readonly group = 'notifications-group';

  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly producer: ClientKafka,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.producer.connect();
    await this.redisService.ensureXGroup(this.stream, this.group);
  }

  async notify() {
    const message = `User signed up for ${new Date().toLocaleString()}`;

    const id = await this.redisService.xadd(
      this.stream,
      '*',
      'message',
      message,
    );

    this.logger.debug(`added message with id ${id}`);

    try {
      await lastValueFrom(
        this.producer.emit('events.notifications', message).pipe(timeout(5000)),
      );

      await this.redisService.xack(this.stream, this.group, id!);
    } catch {
      this.logger.error(
        `Failed to emit message to kafka. Trying to retry via RetryWorker`,
      );
    }
  }
}
