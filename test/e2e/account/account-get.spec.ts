import * as request from 'supertest';
import { app, closeApp, prismaService, setupApp } from './set-up';
import { TransactionType } from '@prisma/client';

describe('GET /account/:id', () => {
  beforeAll(async () => {
    await setupApp();
    const createAccountDto = {
      iban: 'NL91ABNA0417164300',
      balance: 1000,
    };

    await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createAccountDto);
  });

  afterAll(async () => {
    await closeApp();
  });
  it('should get account with transactions', async () => {
    const testAccount = await prismaService.account.findFirst();
    const response = await request(app.getHttpServer())
      .get(`/account/${testAccount.id}`)
      .expect(200);
    expect(response.body).toEqual({
      id: testAccount.id,
      iban: testAccount.iban,
      balance: testAccount.balance,
      userId: testAccount.userId,
      transactions: expect.arrayContaining([
        expect.objectContaining({
          amount: 1000,
          type: TransactionType.DEPOSIT,
        }),
      ]),
    });
  });

  it('should return 404 for non-existent account', async () => {
    await request(app.getHttpServer())
      .get('/account/non-existent-id')
      .expect(404);
  });
});
