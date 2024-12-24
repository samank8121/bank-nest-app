import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { MessagesService, messagesService } from './messages/messages.service';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: MessagesService,
      useValue: messagesService,
    },
  ],
  exports: [PrismaService, MessagesService],
})
export class CommonModule {}
