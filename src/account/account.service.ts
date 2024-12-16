import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
//import { CreateAccountDto } from './dto/create-account.dto';
import { MessagesService } from 'src/messages/messages.service';
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

  async createAccount(dto: CreateAccountDto) {
    const { iban, balance } = dto;
    try {
      const account = await this.prisma.account.create({
        data: {
          iban,
          balance,
          transactions: {
            create: {
              amount: balance,
              type: TransactionType.DEPOSIT,
            },
          },
        },
      });
      return account;
    } catch(error) {      
      throw new HttpException(
        error,
        //this.messagesService.getMessage('errors', 'general'),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  deposit() {}

  withdraw() {}

  transfer() {}
}
