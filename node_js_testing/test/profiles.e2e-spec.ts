import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { CustomLogger } from '../src/logger/logger';
import { mockLogger } from './mocks/logger.mock';
import { ProfileDto } from '../src/profiles/dto/profile.dto';
import { validCreateProfileDto } from './test-data/test-data';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CustomLogger)
      .useValue(mockLogger)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('(POST) /profiles with valid body -> 201', async () => {
    return await request(app.getHttpServer())
      .post('/profiles')
      .set('authorization', `Bearer test`)
      .send(validCreateProfileDto)
      .expect(201)
      .expect((response) => {
        const body = response.body as ProfileDto;

        expect(body).toHaveProperty('id');
        expect(mockLogger.log).toHaveBeenCalledWith(
          `Profile created: ${JSON.stringify(body, null, 2)}`,
        );
      });
  });

  it('(POST) /profiles without auth token -> 403', async () => {
    return await request(app.getHttpServer())
      .post('/profiles')
      .send(validCreateProfileDto)
      .expect(403);
  });
});
