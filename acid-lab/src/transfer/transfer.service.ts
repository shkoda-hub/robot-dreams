import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import { Movement } from './entities/movements.entity';

@Injectable()
export class TransferService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Movement)
    private readonly movementRepository: Repository<Movement>,
  ) {}

  async transfer(transfer: CreateTransferDto): Promise<Movement> {
    const { from: fromId, to: toId, amount } = transfer;

    return await this.dataSource.transaction(
      'SERIALIZABLE',
      async (manager) => {
        const fromAccount = await manager.findOne(Account, {
          where: { id: fromId },
          lock: { mode: 'pessimistic_write' },
        });

        const toAccount = await manager.findOne(Account, {
          where: { id: toId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!fromAccount) {
          throw new BadRequestException(`Account ${fromId} not found`);
        }

        if (!toAccount) {
          throw new BadRequestException(`Account ${toId} not found`);
        }

        if (fromAccount.balance < amount) {
          throw new BadRequestException(`Insufficient balance`);
        }

        // await manager.increment(Account, { id: toId }, 'balance', amount);
        // await manager.decrement(Account, { id: fromId }, 'balance', amount);

        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await manager.save([fromAccount, toAccount]);

        const movement = manager.create(Movement, {
          fromAccount,
          toAccount,
          amount,
        });

        return await manager.save(movement);
      },
    );
  }
}
