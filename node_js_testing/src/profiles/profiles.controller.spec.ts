import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesModule } from './profiles.module';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import * as request from 'supertest';
import { mockLogger } from '../../test/mocks/logger.mock';
import { CustomLogger } from '../logger/logger';
import {
  createProfileDtoWithInvalidEmail,
  validCreateProfileDto,
} from '../../test/test-data/test-data';

describe('AppController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const profilesModule: TestingModule = await Test.createTestingModule({
      imports: [ProfilesModule],
    })
      .overrideProvider(CustomLogger)
      .useValue(mockLogger)
      .compile();

    app = profilesModule.createNestApplication();
    await app.init();
  });

  describe('(POST) /profiles', () => {
    it('should return 201 for valid request body', async () => {
      return await request(app.getHttpServer())
        .post('/profiles')
        .send(validCreateProfileDto)
        .set('authorization', `Bearer test`)
        .expect(201)
        .expect(({ body }) => expect(body).toHaveProperty('id'))
        .expect(({ body }) =>
          expect(body).toMatchObject(validCreateProfileDto),
        );
    });

    it('should return 400 for profile with invalid email', async () => {
      return await request(app.getHttpServer())
        .post('/profiles')
        .send(createProfileDtoWithInvalidEmail)
        .set('authorization', `Bearer test`)
        .expect(400)
        .expect(({ body }) =>
          expect(body).toStrictEqual({
            message: ['email must be an email'],
            error: 'Bad Request',
            statusCode: 400,
          }),
        );
    });
  });
});
