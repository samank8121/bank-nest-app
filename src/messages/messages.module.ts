import { Global, Module } from '@nestjs/common';
import { messagesService, MessagesService } from './messages.service';

@Global()
@Module({
  //providers: [MessagesService],
  providers: [
    {
      provide: MessagesService,
      useValue: messagesService,
    },
  ],
  exports: [MessagesService]
})
export class MessagesModule {}
