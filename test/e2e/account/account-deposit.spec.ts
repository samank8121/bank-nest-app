import * as request from 'supertest';
import { app, prismaService, setupApp, closeApp } from './set-up';

describe('POST /account/deposit', () => {
  beforeAll(async () => {
    await setupApp();
    const createAccountDto = {
      iban: 'NL91ABNA0417164300',
      balance: 0,
    };

    await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createAccountDto);
  });

  afterAll(async () => {
    await closeApp();
  });

  it('should deposit an amount to an account', async () => {
    const testAccount = await prismaService.account.findFirst();
    await request(app.getHttpServer())
      .get(`/account/${testAccount.id}`)
      .expect(200);
    const response = await request(app.getHttpServer())
      .post('/account/deposit')
      .send({ accountId: testAccount.id, amount: 10 })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: testAccount.id,
        balance: 10,
      })
    );
  });
});
