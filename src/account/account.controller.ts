import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/auth/decorator';
import {
  CreateAccountDto,
  DepositAccountDto,
  GetAccountDto,
  ResponseCreateAccountDto,
  ResponseDepositDto,
  ResponseTransferDto,
  ResponseWithdrawDto,
  TransferAccountDto,
  WithdrawAccountDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

import { AccountApiSwagger } from './decorator/account-api.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('account')
@ApiBearerAuth()
@ApiTags('account')
@UseInterceptors(CacheInterceptor)
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  @AccountApiSwagger({
    operation: 'get',
    responseType: GetAccountDto
  })
  getAccount(@Param('id') accountId: string) {
    return this.accountService.getAccount(accountId);
  }

  @Post('create-account')
  @AccountApiSwagger({
    operation: 'create',
    responseType: ResponseCreateAccountDto,
    httpStatus: HttpStatus.CREATED
  })
  createAccount(@User('id') userId: string, @Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(userId, dto);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  @AccountApiSwagger({
    operation: 'deposit',
    responseType: ResponseDepositDto,
  })
  deposit(@Body() dto: DepositAccountDto) {
    return this.accountService.deposit(dto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @AccountApiSwagger({
    operation: 'withdraw',
    responseType: ResponseWithdrawDto
  })
  withdraw(@Body() dto: WithdrawAccountDto) {
    return this.accountService.withdraw(dto);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @AccountApiSwagger({
    operation: 'transfer',
    responseType: ResponseTransferDto
  })
  transfer(@Body() dto: TransferAccountDto) {
    return this.accountService.transfer(dto);
  }
}
