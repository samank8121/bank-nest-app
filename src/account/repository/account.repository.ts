import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetAccountDto,DepositAccountDto,WithdrawAccountDto,TransferAccountDto } from '../dto';
import { CreateAccountInput } from './create-account-input';


@Injectable()
export class AccountRepository extends BaseRepository<GetAccountDto, CreateAccountInput, any> {
  constructor(prisma: PrismaService) {
    super(prisma, 'account');
  }

  async create(data: CreateAccountInput, include?: any) {
    const { iban, balance, userId } = data;
    return this.model.create({
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
      include,
    });
  }

  async deposit(dto: DepositAccountDto) {
    const { accountId, amount } = dto;
    return this.model.update({
      where: { id: accountId },
      data: {
        balance: { increment: amount },
        transactions: {
          create: {
            amount,
            type: TransactionType.DEPOSIT,
          },
        },
      },
    });
  }

  async withdraw(dto: WithdrawAccountDto) {
    const { accountId, amount } = dto;
    return this.model.update({
      where: { id: accountId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: {
            amount: -amount,
            type: TransactionType.WITHDRAW,
          },
        },
      },
    });
  }

  async transfer(dto: TransferAccountDto) {
    const { accountId: fromAccountId, toIban, amount } = dto;
    return this.transaction([
      this.model.update({
        where: { id: fromAccountId },
        data: {
          balance: { decrement: amount },
          transactions: {
            create: {
              amount: -amount,
              type: TransactionType.TRANSFER,
              toAccountIban: toIban,
            },
          },
        },
      }),
      this.model.update({
        where: { iban: toIban },
        data: {
          balance: { increment: amount },
          transactions: {
            create: {
              amount: amount,
              type: TransactionType.TRANSFER,
              toAccountIban: (await this.model.findUnique({ where: { id: fromAccountId } })).iban,
            },
          },
        },
      }),
    ]);
  }
}