import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/auth/decorator';
import {
  CreateAccountDto,
  GetAccountDto,
  ResponseCreateAccountDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('account')
@ApiBearerAuth()
@ApiTags('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Get(':id')
  @ApiOperation({ summary: 'get an account' })
  @ApiOkResponse({ description: 'account found', type: GetAccountDto })
  @ApiBadRequestResponse({ description: 'invalid data' })
  getAccount(@Param('id') accountId: string) {
    return this.accountService.getAccount(accountId);
  }

  @Post('create-account')
  @ApiOperation({ summary: 'add an account' })
  @ApiCreatedResponse({
    description: 'account added successfully',
    type: ResponseCreateAccountDto,
  })
  @ApiBadRequestResponse({ description: 'invalid data' })
  createAccount(@User('id') userId: string, @Body() dto: CreateAccountDto) {
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
