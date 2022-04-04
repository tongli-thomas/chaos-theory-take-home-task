import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRatesController } from './controllers/exchange-rates.controller';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { ExchangeRatesService } from './services/exchange-rates.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([ExchangeRate])],
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService],
  exports: [ExchangeRatesService],
})
export class ExchangeRatesModule {}
