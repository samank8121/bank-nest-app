import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ZodValidationPipe } from 'apps/bank-app/src/pipes/zod-validation.pipe';
import { createAccountSchema, CreateAccountDto } from './validation/account';
import { messagesService } from 'apps/bank-app/src/common-o/messages/messages.service';
import { JwtGuard } from 'apps/bank-app/src/auth/guard/jwt.guard';
import { User } from 'apps/bank-app/src/auth/decorator';

export const createAccountPipe = new ZodValidationPipe(() =>
  createAccountSchema(messagesService.getMessage.bind(messagesService))
);

@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  getAccount(@Param('id') accountId: string) {
    return this.accountService.getAccount(accountId);
  }
  @Post('create-account')
  createAccount(
    @User('id') userId: string,
    @Body(createAccountPipe) dto: CreateAccountDto)
  {
    return this.accountService.createAccount(userId, dto);
  }

  deposit() {
    return this.accountService.deposit();
  }

  withdraw() {
    return this.accountService.withdraw();
  }

  transfer() {
    return this.accountService.transfer();
  }
}
