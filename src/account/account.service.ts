import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import { MessagesService } from 'src/common/messages/messages.service';
import { AccountRepository } from 'src/account/repository/account.repository';
import { CreateAccountDto, GetAccountDto, TransferAccountDto, WithdrawAccountDto } from './dto';
import { DepositAccountDto } from './dto/deposit-account.dto';
import { isValidIBAN } from './validation/valid-iban';


@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly messagesService: MessagesService
  ) {}

  async getAccount(accountId: string): Promise<GetAccountDto> {
    const account = await this.accountRepository.findById(accountId, { transactions: { orderBy: { date: 'desc' } } });
    if (!account) {
      throw new NotFoundException(this.messagesService.getMessage('errors', 'notFound'));
    }
    return account;
  }

  async createAccount(userId: string, dto: CreateAccountDto) {
    try {
      // Include userId in the DTO
      const accountData = { ...dto, userId };
      return await this.accountRepository.create(accountData);
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('iban')) {
        throw new BadRequestException(this.messagesService.getMessage('errors', 'account', 'invalidIban'));
      }
      throw new BadRequestException(this.messagesService.getMessage('errors', 'general'));
    }
  }

  async deposit(dto: DepositAccountDto) {
    try {
      const account = await this.accountRepository.deposit(dto);
      return { id: account.id, balance: account.balance };
    } catch {
      const deposit = this.messagesService.getMessage('account', 'deposit');
      throw new BadRequestException(this.messagesService.getMessage('errors', 'failedTo', { name: deposit }));
    }
  }

  async withdraw(dto: WithdrawAccountDto) {
    try {
      const account = await this.accountRepository.findById(dto.accountId);
      if (!account || account.balance < dto.amount) {
        throw new BadRequestException(this.messagesService.getMessage('errors', 'account', 'insufficientFund'));
      }
      const updatedAccount = await this.accountRepository.withdraw(dto);
      return { id: updatedAccount.id, balance: updatedAccount.balance };
    } catch {
      const withdraw = this.messagesService.getMessage('account', 'withdraw');
      throw new BadRequestException(this.messagesService.getMessage('errors', 'failedTo', { name: withdraw }));
    }
  }

  async transfer(dto: TransferAccountDto) {
    const { accountId: fromAccountId, toIban, amount } = dto;

    if (!isValidIBAN(toIban)) {
      throw new BadRequestException(this.messagesService.getMessage('errors', 'account', 'invalidIban'));
    }

    try {
      const fromAccount = await this.accountRepository.findById(fromAccountId);
      if (!fromAccount || fromAccount.balance < amount) {
        throw new BadRequestException(this.messagesService.getMessage('errors', 'account', 'insufficientFund'));
      }
      if (fromAccount.iban === toIban) {
        throw new BadRequestException(this.messagesService.getMessage('errors', 'account', 'sameAccount'));
      }

      const [updatedFromAccount] = await this.accountRepository.transfer(dto);
      return { balance: updatedFromAccount.balance };
    } catch {
      const transfer = this.messagesService.getMessage('account', 'transfer');
      throw new BadRequestException(this.messagesService.getMessage('errors', 'failedTo', { name: transfer }));
    }
  }
}