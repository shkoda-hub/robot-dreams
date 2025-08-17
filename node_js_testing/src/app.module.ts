import { Module } from '@nestjs/common';
import { ProfilesModule } from './profiles/profiles.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [ProfilesModule, LoggerModule],
})
export class AppModule {}
