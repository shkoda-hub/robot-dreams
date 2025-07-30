import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TransferModule } from '../src/transfer/transfer.module';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../src/transfer/entities/account.entity';
import { Movement } from '../src/transfer/entities/movements.entity';
import { TransferService } from '../src/transfer/transfer.service';
import { Repository } from 'typeorm';

const SET_UP_TIMEOUT = 20_000;

describe('Transfer (e2e)', () => {
  let app: INestApplication<App>;
  let container: StartedTestContainer;

  beforeEach(async () => {
    container = await new GenericContainer('postgres')
      .withEnvironment({
        POSTGRES_DB: 'test',
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
      })
      .withExposedPorts(5432)
      .start();

    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: container.getHost(),
          port: container.getMappedPort(5432),
          username: 'test',
          password: 'test',
          database: 'test',
          entities: [Account, Movement],
          dropSchema: true,
          synchronize: true,
        }),
        TransferModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  }, SET_UP_TIMEOUT);

  afterAll(async () => {
    await app.close();
    await container.stop();
  });

  it('should decline transfer if not enough account balance', async () => {
    const accountRepository = app.get<Repository<Account>>(
      getRepositoryToken(Account),
    );

    const movementRepository = app.get<Repository<Movement>>(
      getRepositoryToken(Movement),
    );

    const firstAccount = accountRepository.create();
    const secondAccount = accountRepository.create();
    await accountRepository.save([firstAccount, secondAccount]);

    const service = app.get(TransferService);
    await expect(
      service.transfer({
        from: firstAccount.id,
        to: secondAccount.id,
        amount: 100,
      }),
    ).rejects.toThrow('Insufficient balance');

    const movements = await movementRepository.find();
    expect(movements).toHaveLength(0);
  });
});
