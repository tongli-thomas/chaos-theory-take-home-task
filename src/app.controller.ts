import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health Check')
export class AppController {
  @Get('api/health')
  helathCheck(): string {
    return 'Ok';
  }

  @Get()
  getHello(): string {
    return 'Ok';
  }
}
