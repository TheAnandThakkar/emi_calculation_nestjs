import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmiCalculationDto } from './dtos/emi-calculation.dto';
import { EmiService } from './emi.service';

@ApiTags('EMI Calculation')
@Controller('emi')
export class EmiController {
  constructor(private readonly emiService: EmiService) {}
  /// calculation of EMI
  @Post('emiCalculation')
  @ApiOperation({ summary: 'EMI Calculation' })
  emiCalculation(@Body() body: EmiCalculationDto) {
    return this.emiService.emiCalculationTest(body);
  }
}
