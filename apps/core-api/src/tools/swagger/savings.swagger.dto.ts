import {ApiProperty} from '@nestjs/swagger';

export class SavingsTrendPointSwaggerDTO {
  @ApiProperty({
    description: 'Full month name',
    example: 'January',
  })
  month: string;

  @ApiProperty({
    description: 'Short month name',
    example: 'Jan',
  })
  monthShort: string;

  @ApiProperty({
    description: 'Saved amount for the month (null if no data)',
    example: 750.0,
    nullable: true,
  })
  amount: number | null;

  @ApiProperty({
    description: 'Indicates whether the month has a recorded savings entry',
    example: true,
  })
  hasData: boolean;
}

export const SavingsTrendArraySwagger = [SavingsTrendPointSwaggerDTO];
