import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './common/dto/api-response.dto';
import { APP_VERSION } from './config/app.constants';

@ApiTags('Health')
@Controller()
export class AppController {
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns a basic liveness payload for the API service.',
  })
  @ApiOkResponse({
    type: HealthResponseDto,
  })
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'professor-resume-api',
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
    };
  }
}
