import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { AccountService } from './account.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createAccountSchema, CreateAccountDto } from './validation/account';
import { messagesService } from 'src/messages/messages.service';

export const createAccountPipe = new ZodValidationPipe(() =>
  createAccountSchema(messagesService.getMessage.bind(messagesService))
);

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  getAccount(@Param('id') accountId: string) {
    return this.accountService.getAccount(accountId);
  }
  @Post('create-account')
  @UsePipes(createAccountPipe)
  createAccount(@Body() dto: CreateAccountDto)
  {
    return this.accountService.createAccount(dto);
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
