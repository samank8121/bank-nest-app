import * as request from 'supertest';
import { app, prismaService, setupApp, closeApp } from './set-up';

describe('POST /account/transfer', () => {
  beforeAll(async () => {
    await setupApp();
    const createSrcAccountDto = {
      iban: 'NL91ABNA0417164300',
      balance: 100,
    };
    const createDesAccountDto = {
      iban: 'NL91ABNA0417164500',
      balance: 0,
    };

    await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createSrcAccountDto);

    await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createDesAccountDto);
  });

  afterAll(async () => {
    await closeApp();
  });

  it('should transfer an amount from one account to others', async () => {
    const srcAccount = await prismaService.account.findFirst({
      where: { iban: 'NL91ABNA0417164300' },
    });
    const response = await request(app.getHttpServer())
      .post('/account/transfer')
      .send({
        accountId: srcAccount.id,
        toIban: 'NL91ABNA0417164500',
        amount: 40,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        balance: 60,
      })
    );
    const desAccount = await prismaService.account.findFirst({
      where: { iban: 'NL91ABNA0417164500' },
    });
    expect(desAccount).toEqual(
      expect.objectContaining({
        id: desAccount.id,
        balance: 40,
      })
    );
  });
});
