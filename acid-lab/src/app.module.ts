import { Module } from '@nestjs/common';
import { TransferModule } from './transfer/transfer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import dataSource from './db/data-source';

@Module({
  imports: [
    TransferModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSource.options,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
    }),
  ],
})
export class AppModule {}
