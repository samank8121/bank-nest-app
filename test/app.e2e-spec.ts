import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { TransactionType } from '@prisma/client';

describe('Bank (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
  };

  const mockJwtGuard = {
    canActivate: (context: any) => {
      const req = context.switchToHttp().getRequest();
      req.user = mockUser;
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the entire app module to use real services
    })
      .overrideGuard(JwtGuard)
      .useValue(mockJwtGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.transaction.deleteMany();
    await prismaService.account.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.user.create({
      data: {
        id: 1,
        email: 'test@example.com',
        hash: 'hashedpassword',
      },
    });
    await app.init();
  });

  describe('POST /account api', () => {
    let testAccount: any;
    describe('POST /account/create-account', () => {
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

        // Verify the account was created in the database
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
        testAccount = account;
      });

      it('should reject duplicate IBAN', async () => {
        const accountDto = {
          iban: testAccount.iban,
          balance: 1000,
        };

        // Try to create account with same IBAN
        await request(app.getHttpServer())
          .post('/account/create-account')
          .send(accountDto)
          .expect(400);
      });
    });

    describe('GET /account/:id', () => {
      it('should get account with transactions', async () => {
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

    describe('Account deposit/withdraw/transfer', () => {
      // Add deposit/withdraw/transfer tests here once
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
