import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { messagesService } from 'src/common/messages/messages.service';

const getMsg = messagesService.getMessage;

@UseGuards(JwtGuard)
@Controller('account')
@ApiBearerAuth()
@ApiTags('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  @ApiOperation({ summary: getMsg('swagger', 'account','get', 'summary') })
  @ApiOkResponse({ description: getMsg('swagger', 'account','get', 'success'), type: GetAccountDto })
  @ApiBadRequestResponse({ description: getMsg('swagger', 'account','get', 'failed') })
  getAccount(@Param('id') accountId: string) {
    return this.accountService.getAccount(accountId);
  }

  @Post('create-account')
  @ApiOperation({ summary: getMsg('swagger', 'account','create', 'summary') })
  @ApiCreatedResponse({
    description: getMsg('swagger', 'account','create', 'success'),
    type: ResponseCreateAccountDto,
  })
  @ApiBadRequestResponse({ description: getMsg('swagger', 'account','create', 'failed') })
  createAccount(@User('id') userId: string, @Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(userId, dto);
  }

  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: getMsg('swagger', 'account','deposit', 'summary') })
  @ApiOkResponse({
    description: getMsg('swagger', 'account','deposit', 'success'),
    type: ResponseDepositDto,
  })
  @ApiBadRequestResponse({ description: getMsg('swagger', 'account','deposit', 'failed') })
  deposit(@Body() dto: DepositAccountDto) {
    return this.accountService.deposit(dto);
  }

  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: getMsg('swagger', 'account','withdraw', 'summary') })
  @ApiOkResponse({
    description: getMsg('swagger', 'account','withdraw', 'success'),
    type: ResponseWithdrawDto,
  })
  @ApiBadRequestResponse({ description: getMsg('swagger', 'account','withdraw', 'failed') })
  withdraw(@Body() dto: WithdrawAccountDto) {
    return this.accountService.withdraw(dto);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: getMsg('swagger', 'account','transfer', 'summary') })
  @ApiOkResponse({
    description: getMsg('swagger', 'account','transfer', 'success'),
    type: ResponseTransferDto,
  })
  @ApiBadRequestResponse({ description: getMsg('swagger', 'account','transfer', 'failed') })
  transfer(@Body() dto: TransferAccountDto) {
    return this.accountService.transfer(dto);
  }
}
