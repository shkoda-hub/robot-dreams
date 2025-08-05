import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  handleUserSignedUp(msg: any) {
    this.logger.log(msg);
  }
}
