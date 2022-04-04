import { HttpService } from '@nestjs/axios';
import { Get, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { ExtExchangePairResponseDto } from '../dtos/ext-exchange-pair-resp.dto';
import { GetAverageExchangeRateRespDto } from '../dtos/get-average-exchange-rate-resp.dto';
import { GetLatestExchangeRateRespDto } from '../dtos/get-latest-exchange-rate-resp.dto';
import { SearchExchangeRateRespDto } from '../dtos/search-exchange-rate-resp.dto';
import { ExchangeRate } from '../entities/exchange-rate.entity';

@Injectable()
export class ExchangeRatesService {
  private readonly logger = new Logger(ExchangeRatesService.name);

  constructor(
    @InjectRepository(ExchangeRate)
    private exchangeRateRepo: Repository<ExchangeRate>,
    private httpService: HttpService,
  ) {}

  async getBtcUsdPair() {
    const res = await lastValueFrom(
      this.httpService.get<ExtExchangePairResponseDto>(
        `${process.env.EXT_EXCHANGE_API_BASE}/BTC-USD`,
      ),
    );

    const { last_trade_price, symbol } = res.data;
    const exchangeRate = {
      price: last_trade_price,
      symbol,
    };

    const afterSave = await this.exchangeRateRepo.save(exchangeRate);
    this.logger.debug(afterSave);
  }

  async getLatestExchangeRate(): Promise<GetLatestExchangeRateRespDto> {
    const rate = await this.exchangeRateRepo.find({
      order: {
        timestamp: 'DESC',
      },
      take: 1,
    });
    if (!rate?.length) {
      throw new NotFoundException();
    }

    return rate[0];
  }

  async getAverageExchangeRate(
    startTimestamp: string,
    endTimestamp: string,
  ): Promise<GetAverageExchangeRateRespDto> {
    const rates = await this.exchangeRateRepo.find({
      timestamp: Between(startTimestamp, endTimestamp),
    });

    return {
      price: !rates.length
        ? 0
        : rates
            .map((rate) => rate.price)
            .reduce((previous, current) => previous + current) / rates.length,
    };
  }

  @Get()
  async searchExchangeRate(
    timestamp: string,
  ): Promise<SearchExchangeRateRespDto> {
    const exactMatch = await this.exchangeRateRepo.findOne({ timestamp });
    const earlierBackups = await this.exchangeRateRepo.find({
      order: {
        timestamp: 'DESC',
      },
      where: {
        timestamp: LessThan(timestamp),
      },
      take: 1,
    });

    const laterBackups = await this.exchangeRateRepo.find({
      order: {
        timestamp: 'ASC',
      },
      where: {
        timestamp: MoreThan(timestamp),
      },
      take: 1,
    });

    return {
      exactMatch: exactMatch || null,
      earlierBackup: earlierBackups?.length ? earlierBackups[0] : null,
      laterBackup: laterBackups?.length ? laterBackups[0] : null,
    };
  }
}
