import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module'; // ✅ Додаємо модуль користувачів
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City, CitySchema } from './schemas/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService, MongooseModule],
})
export class CitiesModule {}
