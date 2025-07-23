import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { Account } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './entities/movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Movement])],
  providers: [TransferService],
  controllers: [TransferController],
})
export class TransferModule {}
