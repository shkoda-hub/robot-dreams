import { LoggerService } from './logger.service';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @EventPattern('events.notifications')
  handleUserSignedUp(@Payload() msg: any) {
    this.loggerService.handleUserSignedUp(msg);
  }
}
