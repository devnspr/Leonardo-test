import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
jest.useFakeTimers();

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  it('should get all acronyms', async function () {
    const response = await request(app.getHttpServer())
      .get('/acronym')
      .expect(200);
    expect(response.body).toHaveProperty('acronyms');
    expect(response.body.acronyms).toBeDefined();
    expect(response.body.acronyms.length).toBeGreaterThan(0);
  });
});
