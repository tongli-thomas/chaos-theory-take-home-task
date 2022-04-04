import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class GetAverageExchangeRateReqDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Timestamp is in ISO(86) format, i.e., yyyy-mm-dd hh:MM:ss',
  })
  startTimestamp: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    description: 'Timestamp is in ISO(86) format, i.e., yyyy-mm-dd hh:MM:ss',
  })
  endTimestamp: string;
}
