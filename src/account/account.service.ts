import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MessagesService } from 'src/common/messages/messages.service';
import { CreateAccountDto, GetAccountDto } from './dto';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private readonly messagesService: MessagesService
  ) {}

  async getAccount(accountId: string): Promise<GetAccountDto> {
    const response = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        transactions: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });
    return response;
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
