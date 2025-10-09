import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './repository/account.repository';

@Module({
  providers: [AccountService, AccountRepository],
  controllers: [AccountController]
})
export class AccountModule {}
