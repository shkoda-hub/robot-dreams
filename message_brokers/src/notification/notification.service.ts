import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';
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
    await this.tryToEmit(message);
  }

  private async appendToRedis(message: string) {
    return await this.redisService.xadd(this.stream, '*', 'message', message);
  }

  private async tryToEmit(message: string) {
    try {
      await lastValueFrom(
        this.producer
          .emit('events.notifications', message)
          .pipe(timeout(2000), retry({ count: 3, delay: 500 })),
      );
    } catch {
      const messageId = await this.appendToRedis(message);
      this.logger.error(
        `Failed to emit message to kafka. Trying to retry via RetryWorker. MessageId: ${messageId}`,
      );

      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
