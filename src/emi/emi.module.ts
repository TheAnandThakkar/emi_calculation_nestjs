import { Module } from '@nestjs/common';
import { EmiController } from './emi.controller';
import { EmiService } from './emi.service';

@Module({
  controllers: [EmiController],
  providers: [EmiService]
})
export class EmiModule {}
