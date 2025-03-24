import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateCityDto } from './dtos/create-city.dto';
import { UpdateCityDto } from './dtos/update-city.dto';
import { City } from './schemas/city.schema';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(
    @InjectModel(City.name) private cityModel: Model<City>,
    private readonly usersService: UsersService, // ✅ Використовуємо UsersService для роботи з користувачами
  ) {}

  async create(dto: CreateCityDto, user: any): Promise<City> {
    this.validateAdmin(user);

    if (!isValidObjectId(user.id)) {
      throw new BadRequestException('Некоректний ID користувача');
    }

    const createdBy = new Types.ObjectId(user.id);
    const city = await this.cityModel.create({
      name: dto.name,
      createdBy,
    });

    if (!city._id) {
      throw new Error('Помилка створення міста');
    }

    this.logger.log(`✅ Місто ${city._id} створене користувачем ${user.id}`);

    // Додаємо місто до списку створених користувачем
    await this.usersService.addCreatedEntity(
      user.id,
      city._id.toString(),
      'city',
    );

    return city.populate('createdBy');
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().populate('createdBy', 'email role').exec();
  }

  async findOne(id: string): Promise<City> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID міста');
    }

    const city = await this.cityModel
      .findById(id)
      .populate('createdBy', 'email role')
      .exec();
    if (!city) throw new NotFoundException('Місто не знайдено');

    return city;
  }

  async update(id: string, dto: UpdateCityDto, user: any): Promise<City> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID міста');
    }

    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('Місто не знайдено');
    }

    if (city.createdBy.toHexString() !== user.id) {
      throw new ForbiddenException('Ви можете оновлювати тільки свої міста');
    }

    Object.assign(city, dto);
    await city.save();

    this.logger.log(`✅ Місто ${id} оновлено користувачем ${user.id}`);

    return city.populate('createdBy');
  }

  async remove(id: string, user: any): Promise<{ message: string }> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID міста');
    }

    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('Місто не знайдено');
    }

    if (city.createdBy.toHexString() !== user.id) {
      throw new ForbiddenException('Ви можете видаляти тільки свої міста');
    }

    await this.cityModel.findByIdAndDelete(id).exec();

    await this.usersService.removeCreatedEntity(user.id, id, 'city');

    this.logger.log(`❌ Місто ${id} видалене користувачем ${user.id}`);

    return { message: 'Місто успішно видалене' };
  }

  private validateAdmin(user: any) {
    if (!user || user.role !== 'admin') {
      this.logger.warn(`🚫 Доступ заборонено для користувача ${user?.id}`);
      throw new ForbiddenException('Доступ заборонено');
    }
  }
}
