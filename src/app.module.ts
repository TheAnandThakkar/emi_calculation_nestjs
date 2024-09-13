import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmiModule } from './emi/emi.module';

@Module({
  imports: [EmiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
