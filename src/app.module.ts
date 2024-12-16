import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [PrismaModule, AccountModule, MessagesModule],
})
export class AppModule {}
