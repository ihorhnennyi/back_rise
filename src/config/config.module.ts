import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigController } from './config.controller';
import envConfig from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
  ],
  controllers: [ConfigController],
})
export class ConfigAppModule {}
