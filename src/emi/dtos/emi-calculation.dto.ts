import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';
import { TenureEnum } from '../enum/tenure-enum';

export class EmiCalculationDto {
  @ApiProperty({ description: 'Enter the loan amount' })
  @IsNotEmpty()
  @Max(500000)
  @Min(1000)
  basic_principal_amount: number;

  @ApiProperty({ default: TenureEnum.THREE })
  @IsEnum(TenureEnum)
  tenure: TenureEnum;

  @ApiProperty({ default: 20 })
  @Max(100)
  @Min(1)
  interest_rate: number;

  @ApiProperty({ example: 'MM-dd-YYYY' })
  @IsNotEmpty()
  salary_cycle_date: string;

  @ApiProperty({ example: 'MM-dd-YYYY' })
  @IsNotEmpty()
  loan_disbursement_date: string;
}
