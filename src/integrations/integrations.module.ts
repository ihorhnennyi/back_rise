import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { Integration, IntegrationSchema } from './schemas/integration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Integration.name, schema: IntegrationSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
