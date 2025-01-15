import { isValidIBAN } from '../validation/valid-iban';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, Validate } from 'class-validator';
import { messagesService } from 'src/common/messages/messages.service';

export class CreateAccountDto {
  @ApiProperty({
    description: 'IBAN',
    example: 'DE89370400440532013000',
  })
  @IsString({ message: messagesService.getMessage('errors', 'account', 'invalidIban') })
  @Validate((value: string) => isValidIBAN(value), {
    message: messagesService.getMessage('errors', 'account', 'invalidIban'),
  })
  iban: string;

  @ApiProperty({
    description: 'Initial balance of the account',
    example: 1000,
    minimum: 0,
  })
  @IsNumber(
    {},
    {
      message: messagesService.getMessage('account', 'number', {
        item: messagesService.getMessage('account', 'balance'),
      }),
    }
  )
  @Min(0, {
    message: messagesService.getMessage('account', 'positive', {
      item: messagesService.getMessage('account', 'balance'),
    }),
  })
  balance: number;
}
export class ResponseCreateAccountDto {
  @ApiProperty({
    description: messagesService.getMessage('errors', 'account', 'invalidIban'),
    example: 'Account id',
  })
  id: string;

  @ApiProperty({
    description: messagesService.getMessage('errors', 'account', 'invalidIban'),
    example: 'DE89370400440532013000',
  })
  iban: string;

  @ApiProperty({
    description: 'Balance of the account',
    example: 1000,
    minimum: 0,
  })
  balance: number;

  @ApiProperty({
    description: messagesService.getMessage('errors', 'account', 'invalidIban'),
    example: 'User Id',
  })
  userId: number;
}
