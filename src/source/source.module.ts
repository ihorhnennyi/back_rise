import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { Source, SourceSchema } from './schemas/source.schema';
import { SourcesController } from './source.controller';
import { SourcesService } from './source.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Source.name, schema: SourceSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SourcesController],
  providers: [SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
