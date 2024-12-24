import { TransactionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class TransactionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: TransactionType })
  type: TransactionType;

  @ApiProperty()
  accountId: string;

  @ApiProperty({ nullable: true })
  toAccountIban: string | null;
}

export class GetAccountDto {
  @ApiProperty({ type: [TransactionDto] })
  transactions: TransactionDto[];

  @ApiProperty()
  id: string;

  @ApiProperty()
  iban: string;

  @ApiProperty()
  balance: number;
}