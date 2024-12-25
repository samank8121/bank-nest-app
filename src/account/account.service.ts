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
    if (!response) {
      throw new HttpException(
        this.messagesService.getMessage('errors', 'notFound'),
        HttpStatus.NOT_FOUND
      );
    }
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
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('iban')) {
        throw new HttpException(
          this.messagesService.getMessage('account', 'invalidIban'),
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        this.messagesService.getMessage('errors', 'general'),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  deposit() {}

  withdraw() {}

  transfer() {}
}
