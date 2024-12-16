import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [AccountModule, CommonModule],
})
export class AppModule {}
