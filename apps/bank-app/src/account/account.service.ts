import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'apps/bank-app/src/common-o/prisma/prisma.service';
import { MessagesService } from 'apps/bank-app/src/common-o/messages/messages.service';
import { CreateAccountDto } from './validation/account';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private readonly messagesService: MessagesService
  ) {}

  async getAccount(accountId: string) {
    return await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
  }

  async createAccount(userId: string, dto: CreateAccountDto) {
    const { iban, balance } = dto;
    try {
      const account = await this.prisma.account.create({
        data: {
          iban,
          balance,
          user: {
            connect: {
              id: Number.parseInt(userId),
            },
          },
          transactions: {
            create: {
              amount: balance,
              type: TransactionType.DEPOSIT,
            },
          },
        },
      });
      return account;
    } catch {
      throw new HttpException(
        this.messagesService.getMessage('errors', 'general'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  deposit() {}

  withdraw() {}

  transfer() {}
}