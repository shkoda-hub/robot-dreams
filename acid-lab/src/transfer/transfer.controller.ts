import { Body, Controller, Post } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async transfer(@Body() transfer: CreateTransferDto) {
    console.log(transfer);
    return await this.transferService.transfer(transfer);
  }
}
