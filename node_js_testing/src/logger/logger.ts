import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CustomLogger implements LoggerService {
  error(...messages: any): void {
    console.error(`[ERROR]: `, messages);
  }

  log(...messages: any): void {
    console.log(`[INFO]: `, messages);
  }

  warn(...messages: any): void {
    console.warn(`[WARN]: `, messages);
  }
}
