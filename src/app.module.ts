import { Module } from '@nestjs/common';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { MessagesModule } from './common/modules/messages/messages.module';

@Module({
  imports: [PrismaModule, AccountModule, MessagesModule],
})
export class AppModule {}
