import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module'; // ✅ Додаємо UsersModule
import { Status, StatusSchema } from './schemas/status.schema';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [StatusesController],
  providers: [StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {}
