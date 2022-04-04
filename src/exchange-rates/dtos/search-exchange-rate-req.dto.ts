import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class SearchExchangeRateReqDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Timestamp is in ISO(86) format, i.e., yyyy-mm-dd hh:MM:ss',
  })
  timestamp: string;
}
