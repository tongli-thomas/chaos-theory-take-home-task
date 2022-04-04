import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ExchangeRatesService } from './exchange-rates/services/exchange-rates.service';

@Injectable()
export class AppService {
  constructor(private exchangeRatesService: ExchangeRatesService) {}

  @Cron('* * * * *')
  async scheduleGetBtcUsdPair() {
    await this.exchangeRatesService.getBtcUsdPair();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
