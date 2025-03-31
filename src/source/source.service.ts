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
import { CreateSourceDto } from './dtos/create-source.dto';
import { UpdateSourceDto } from './dtos/update-source.dto';
import { Source } from './schemas/source.schema';

@Injectable()
export class SourcesService {
  private readonly logger = new Logger(SourcesService.name);

  constructor(
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateSourceDto, user: any): Promise<Source> {
    this.validateAdmin(user);

    if (!isValidObjectId(user.id)) {
      throw new BadRequestException('Некоректний ID користувача');
    }

    const createdBy = new Types.ObjectId(user.id);
    const source = await this.sourceModel.create({
      name: dto.name,
      createdBy,
    });

    if (!source._id) {
      throw new Error('Помилка створення джерела');
    }

    this.logger.log(
      `✅ Джерело ${source._id} створене користувачем ${user.id}`,
    );

    await this.usersService.addCreatedEntity(
      user.id,
      source._id.toString(),
      'source',
    );

    return source.populate('createdBy');
  }

  async findAll(): Promise<Source[]> {
    return this.sourceModel.find().populate('createdBy', 'email role').exec();
  }

  async findOne(id: string): Promise<Source> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID джерела');
    }

    const source = await this.sourceModel
      .findById(id)
      .populate('createdBy', 'email role')
      .exec();
    if (!source) throw new NotFoundException('Джерело не знайдено');

    return source;
  }

  async update(id: string, dto: UpdateSourceDto, user: any): Promise<Source> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID джерела');
    }

    const source = await this.sourceModel.findById(id).exec();
    if (!source) {
      throw new NotFoundException('Джерело не знайдено');
    }

    if (source.createdBy.toHexString() !== user.id) {
      throw new ForbiddenException('Ви можете оновлювати тільки свої джерела');
    }

    Object.assign(source, dto);
    await source.save();

    this.logger.log(`✅ Джерело ${id} оновлено користувачем ${user.id}`);

    return source.populate('createdBy');
  }

  async remove(id: string, user: any): Promise<{ message: string }> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID джерела');
    }

    const source = await this.sourceModel.findById(id).exec();
    if (!source) {
      throw new NotFoundException('Джерело не знайдено');
    }

    if (source.createdBy.toHexString() !== user.id) {
      throw new ForbiddenException('Ви можете видаляти тільки свої джерела');
    }

    await this.sourceModel.findByIdAndDelete(id).exec();

    await this.usersService.removeCreatedEntity(user.id, id, 'source');

    this.logger.log(`❌ Джерело ${id} видалене користувачем ${user.id}`);

    return { message: 'Джерело успішно видалене' };
  }

  private validateAdmin(user: any) {
    if (!user || user.role !== 'admin') {
      this.logger.warn(`🚫 Доступ заборонено для користувача ${user?.id}`);
      throw new ForbiddenException('Доступ заборонено');
    }
  }
}
