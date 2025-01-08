import * as request from 'supertest';
import { app, prismaService, setupApp, closeApp } from './set-up';
import { TransactionType } from '@prisma/client';

describe('POST /account/create-account', () => {
  beforeAll(async () => {
    await setupApp();
  });

  afterAll(async () => {
    await closeApp();
  });

  it('should create new account with initial balance', async () => {
    const createAccountDto = {
      iban: 'NL91ABNA0417164300',
      balance: 1000,
    };

    const response = await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createAccountDto)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        iban: createAccountDto.iban,
        balance: createAccountDto.balance,
      })
    );

    const account = await prismaService.account.findUnique({
      where: { id: response.body.id },
      include: { transactions: true },
    });

    expect(account).toBeTruthy();
    expect(account.transactions).toHaveLength(1);
    expect(account.transactions[0]).toEqual(
      expect.objectContaining({
        amount: createAccountDto.balance,
        type: TransactionType.DEPOSIT,
      })
    );
  });

  it('should reject duplicate IBAN', async () => {
    const createAccountDto = {
      iban: 'NL91ABNA0417164300',
      balance: 1000,
    };

    await request(app.getHttpServer())
      .post('/account/create-account')
      .send(createAccountDto)
      .expect(400);
  });
});
