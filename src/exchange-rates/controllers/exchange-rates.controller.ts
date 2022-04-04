import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAverageExchangeRateReqDto } from '../dtos/get-average-exchange-rate-req.dto';
import { GetAverageExchangeRateRespDto } from '../dtos/get-average-exchange-rate-resp.dto';
import { GetLatestExchangeRateRespDto } from '../dtos/get-latest-exchange-rate-resp.dto';
import { SearchExchangeRateReqDto } from '../dtos/search-exchange-rate-req.dto';
import { SearchExchangeRateRespDto } from '../dtos/search-exchange-rate-resp.dto';
import { ExchangeRatesService } from '../services/exchange-rates.service';

@ApiTags('Exchange Rates')
@Controller('api/exchange-rates')
export class ExchangeRatesController {
  constructor(private exchangeRatesService: ExchangeRatesService) {}

  /**
   * Returns average price within a specified time period
   * @param reqDto
   */
  @Get('average')
  async getAverageExchangeRate(
    @Query() reqDto: GetAverageExchangeRateReqDto,
  ): Promise<GetAverageExchangeRateRespDto> {
    return await this.exchangeRatesService.getAverageExchangeRate(
      reqDto.startTimestamp,
      reqDto.endTimestamp,
    );
  }

  /**
   * Returns latest btc-usd pair
   */
  @Get('latest')
  async getLatestExchangeRate(): Promise<GetLatestExchangeRateRespDto> {
    return await this.exchangeRatesService.getLatestExchangeRate();
  }

  /**
   * Returns average price within a specified time period
   * @param reqDto
   */
  @Get('search')
  async searchExchangeRate(
    @Query() reqDto: SearchExchangeRateReqDto,
  ): Promise<SearchExchangeRateRespDto> {
    return await this.exchangeRatesService.searchExchangeRate(reqDto.timestamp);
  }
}
