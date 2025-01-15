import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { messagesService } from 'src/common/messages/messages.service';

const getMsg = messagesService.getMessage;

export class DepositAccountDto {
  @ApiProperty({
    description: getMsg('account', 'accountId'),
  })
  @IsString({ message: getMsg('account', 'string', {
    item: getMsg('account', 'accountId'),
  }), })
  accountId: string;

  @ApiProperty({
    description: getMsg('swagger', 'account', 'deposit', 'amount'),
    example: 1000,
    minimum: 0.1,
  })
  @IsNumber(
    {},
    {
      message: getMsg('account', 'number', {
        item: getMsg('account', 'amount'),
      }),
    }
  )
  @Min(0, {
    message: getMsg('account', 'positive', {
      item: getMsg('account', 'amount'),
    }),
  })
  amount: number;
}
export class ResponseDepositDto {
  @ApiProperty({
    description: getMsg('account', 'accountId')
  })
  id: string;

  @ApiProperty({
    description: getMsg('swagger', 'account', 'balance'),
    example: 1000,
    minimum: 0,
  })
  balance: number;
}
