import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import {
  DataSource,
  EntityManager,
  QueryFailedError,
  Repository,
} from 'typeorm';
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
      'READ COMMITTED',
      async (manager) => {
        const fromAccount = await this.findAccount(manager, fromId);
        const toAccount = await this.findAccount(manager, toId);

        await this.adjustBalance(manager, fromId, toId, amount);

        return await this.saveMovement(manager, fromAccount, toAccount, amount);
      },
    );
  }

  private async findAccount(
    manager: EntityManager,
    id: string,
  ): Promise<Account> {
    const account = await manager.findOne(Account, {
      where: { id },
      lock: { mode: 'pessimistic_write' },
    });

    if (!account) throw new BadRequestException(`Account ${id} not found`);

    return account;
  }

  private async adjustBalance(
    manager: EntityManager,
    fromId: string,
    toId: string,
    amount: number,
  ): Promise<void> {
    try {
      await manager.decrement(Account, { id: fromId }, 'balance', amount);
      await manager.increment(Account, { id: toId }, 'balance', amount);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23514'
      ) {
        throw new BadRequestException('Insufficient balance');
      } else {
        throw error;
      }
    }
  }

  private async saveMovement(
    manager: EntityManager,
    fromAccount: Account,
    toAccount: Account,
    amount: number,
  ): Promise<Movement> {
    const movement = manager.create(Movement, {
      fromAccount: fromAccount,
      toAccount: toAccount,
      amount,
    });

    return await manager.save(movement);
  }
}
