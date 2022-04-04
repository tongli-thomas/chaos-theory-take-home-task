import { HttpModule } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindConditions, FindOneOptions, Repository } from 'typeorm';
import { ExchangeRate } from '../entities/exchange-rate.entity';
import { ExchangeRatesService } from './exchange-rates.service';

describe('ExchangeRatesService', () => {
  let service: ExchangeRatesService;
  let exchangeRateRepo: Repository<ExchangeRate>;

  const BTC_USD_EXCHANGE_REPO_TOKEN = getRepositoryToken(ExchangeRate);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        ExchangeRatesService,
        {
          provide: BTC_USD_EXCHANGE_REPO_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExchangeRatesService>(ExchangeRatesService);
    exchangeRateRepo = module.get<Repository<ExchangeRate>>(
      BTC_USD_EXCHANGE_REPO_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetAverageExchangeRate', () => {
    it('should return the average exchange rate within the input time range (inclusive)', async () => {
      jest.spyOn(exchangeRateRepo, 'find').mockReturnValueOnce(
        Promise.resolve([
          {
            id: 1,
            price: 100,
            timestamp: '2022-04-03 16:09:59',
            symbol: 'BTC-USD',
          },
          {
            id: 2,
            price: 200,
            timestamp: '2022-04-03 16:11:59',
            symbol: 'BTC-USD',
          },
          {
            id: 3,
            price: 300,
            timestamp: '2022-04-03 16:13:59',
            symbol: 'BTC-USD',
          },
        ]),
      );

      const result = await service.getAverageExchangeRate(
        '2022-04-03 16:09:59',
        '2022-04-03 16:13:59',
      );

      expect(result.price).toBe(200);
    });

    it('should return price as 0 if there is no exchange rate data within the input time range', async () => {
      jest
        .spyOn(exchangeRateRepo, 'find')
        .mockReturnValueOnce(Promise.resolve([]));

      const result = await service.getAverageExchangeRate(
        '2022-04-03 16:09:59',
        '2022-04-03 16:13:59',
      );

      expect(result.price).toBe(0);
    });
  });

  describe('GetLatestExchangeRate', () => {
    it('should return the latest exchange rate', async () => {
      jest.spyOn(exchangeRateRepo, 'find').mockReturnValueOnce(
        Promise.resolve([
          {
            id: 2,
            price: 200,
            timestamp: '2022-04-03 16:11:59',
            symbol: 'BTC-USD',
          },
          {
            id: 1,
            price: 100,
            timestamp: '2022-04-03 16:09:59',
            symbol: 'BTC-USD',
          },
        ]),
      );

      const result = await service.getLatestExchangeRate();

      expect(result.price).toBe(200);
    });

    it('should throw Exception if there is no exchange rate data', async () => {
      jest
        .spyOn(exchangeRateRepo, 'find')
        .mockReturnValueOnce(Promise.resolve([]));

      await expect(service.getLatestExchangeRate()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('SearchExchangeRate', () => {
    it('should return an exactMatch if the timestamp of input matches that of a exchange rate record', async () => {
      jest.spyOn(exchangeRateRepo, 'findOne').mockReturnValueOnce(
        Promise.resolve({
          id: 2,
          price: 200,
          timestamp: '2022-04-03 16:11:59',
          symbol: 'BTC-USD',
        }),
      );

      const result = await service.searchExchangeRate('2022-04-03 16:11:59');

      expect(result.exactMatch).toEqual({
        id: 2,
        price: 200,
        timestamp: '2022-04-03 16:11:59',
        symbol: 'BTC-USD',
      });
    });

    it('should return backups if no exactMatch could be found', async () => {
      jest
        .spyOn(exchangeRateRepo, 'findOne')
        .mockReturnValueOnce(Promise.resolve(undefined));

      jest
        .spyOn(exchangeRateRepo, 'find')
        .mockImplementation(
          (
            conditions?: FindConditions<ExchangeRate>,
          ): Promise<ExchangeRate[]> => {
            if ((conditions as FindOneOptions).order.timestamp === 'DESC') {
              return Promise.resolve([
                {
                  id: 2,
                  price: 200,
                  timestamp: '2022-04-03 16:11:59',
                  symbol: 'BTC-USD',
                },
              ]);
            }

            if ((conditions as FindOneOptions).order.timestamp === 'ASC') {
              return Promise.resolve([
                {
                  id: 3,
                  price: 200,
                  timestamp: '2022-04-03 16:13:59',
                  symbol: 'BTC-USD',
                },
              ]);
            }
          },
        );

      const result = await service.searchExchangeRate('2022-04-03 16:12:59');

      expect(result.exactMatch).toBeNull();
      expect(result.earlierBackup).toEqual({
        id: 2,
        price: 200,
        timestamp: '2022-04-03 16:11:59',
        symbol: 'BTC-USD',
      });
      expect(result.laterBackup).toEqual({
        id: 3,
        price: 200,
        timestamp: '2022-04-03 16:13:59',
        symbol: 'BTC-USD',
      });
    });
  });
});
