import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

export let app: INestApplication;
export let prismaService: PrismaService;

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

export const setupApp = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
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
};

export const closeApp = async () => {
  await app.close();
};
