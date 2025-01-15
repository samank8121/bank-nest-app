import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MessagesService } from 'src/common/messages/messages.service';
import { CreateAccountDto, GetAccountDto, TransferAccountDto, WithdrawAccountDto } from './dto';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { isValidIBAN } from './validation/valid-iban';

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
      throw new NotFoundException(
        this.messagesService.getMessage('errors', 'notFound')
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
        throw new BadRequestException(
          this.messagesService.getMessage('errors', 'account', 'invalidIban')
        );
      }
      throw new BadRequestException(
        this.messagesService.getMessage('errors', 'general')
      );
    }
  }

  async deposit(dto: DepositAccountDto) {
    const { accountId, amount } = dto;
    try {
      const account = await this.prisma.account.update({
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

      return { id: account.id, balance: account.balance };
    } catch {
      const deposit = this.messagesService.getMessage('account', 'deposit');
      throw new BadRequestException(
        this.messagesService.getMessage('errors', 'failedTo', {
          name: deposit,
        })
      );
    }
  }

  async withdraw(dto: WithdrawAccountDto) {
    const { accountId, amount } = dto;
    try {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account || account.balance < amount) {
        throw new BadRequestException(
          this.messagesService.getMessage(
            'errors',
            'account',
            'insufficientFund'
          )
        );
      }

      const updatedAccount = await this.prisma.account.update({
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

      return {
        id: updatedAccount.id,
        balance: updatedAccount.balance,
      };
    } catch {
      const withdraw = this.messagesService.getMessage('account', 'withdraw');
      throw new BadRequestException(
        this.messagesService.getMessage('errors', 'failedTo', {
          name: withdraw,
        })
      );
    }
  }

  async transfer(dto: TransferAccountDto) {
    const { accountId: fromAccountId, toIban, amount } = dto;

    if (!isValidIBAN(toIban)) {
      throw new BadRequestException(
        this.messagesService.getMessage('errors', 'account', 'invalidIban') 
      );
    }

    try {
      const fromAccount = await this.prisma.account.findUnique({
        where: { id: fromAccountId },
      });
      if (!fromAccount || fromAccount.balance < amount) {
        throw new BadRequestException(
          this.messagesService.getMessage('errors', 'account', 'insufficientFund')
        );
      }
      if (fromAccount.iban === toIban) {
        throw new BadRequestException(
          this.messagesService.getMessage('errors', 'account', 'sameAccount')
        );
      }

      const [updatedFromAccount] = await this.prisma.$transaction([
        this.prisma.account.update({
          where: { iban: fromAccount.iban },
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
        this.prisma.account.update({
          where: { iban: toIban },
          data: {
            balance: { increment: amount },
            transactions: {
              create: {
                amount: amount,
                type: TransactionType.TRANSFER,
                toAccountIban: fromAccount.iban,
              },
            },
          },
        }),
      ]);

      return {
        balance: updatedFromAccount.balance,
      };
    } catch {
      const transfer = this.messagesService.getMessage('account', 'transfer');
      throw new BadRequestException(
        this.messagesService.getMessage('errors', 'failedTo', {
          name: transfer,
        })
      );
    }
  }
}
