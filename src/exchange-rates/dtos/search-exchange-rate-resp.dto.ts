import { ExchangeRate } from '../entities/exchange-rate.entity';

export class SearchExchangeRateRespDto {
  exactMatch: ExchangeRate;
  earlierBackup: ExchangeRate;
  laterBackup: ExchangeRate;
}
