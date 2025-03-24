import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  getConfig() {
    return {
      port: this.configService.get<number>('port'),
      database: this.configService.get<string>('database.uri'),
      jwtSecret: this.configService.get<string>('jwt.secret'),
    };
  }
}
