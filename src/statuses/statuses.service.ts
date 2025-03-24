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
import { CreateStatusDto } from './dtos/create-status.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { Status } from './schemas/status.schema';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);

  constructor(
    @InjectModel(Status.name) private statusModel: Model<Status>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateStatusDto, user: any): Promise<Status> {
    this.validateAdmin(user);

    if (!isValidObjectId(user.id)) {
      throw new BadRequestException('Некоректний ID користувача');
    }

    const createdBy = new Types.ObjectId(user.id);
    const status = await this.statusModel.create({
      name: dto.name,
      color: dto.color, // ✅ Додаємо колір
      createdBy,
    });

    await this.usersService.addCreatedEntity(
      user.id,
      (status._id as Types.ObjectId).toString(),
      'status',
    );

    this.logger.log(
      `✅ Статус "${dto.name}" (колір: ${dto.color}) створено користувачем ${user.id}`,
    );

    return status.populate('createdBy');
  }

  async findAll(): Promise<Status[]> {
    return this.statusModel.find().populate('createdBy', 'email role').exec();
  }

  async findOne(id: string): Promise<Status> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID статусу');
    }

    const status = await this.statusModel
      .findById(id)
      .populate('createdBy', 'email role')
      .exec();

    if (!status) throw new NotFoundException('Статус не знайдено');

    return status;
  }

  async update(id: string, dto: UpdateStatusDto, user: any): Promise<Status> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID статусу');
    }

    const status = await this.statusModel.findById(id).exec();
    if (!status) throw new NotFoundException('Статус не знайдено');

    Object.assign(status, dto);
    await status.save();

    this.logger.log(
      `✏️ Статус "${status.name}" оновлено (новий колір: ${status.color}) користувачем ${user.id}`,
    );

    return status.populate('createdBy');
  }

  async delete(id: string, user: any): Promise<void> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID статусу');
    }

    const status = await this.statusModel.findById(id).exec();
    if (!status) throw new NotFoundException('Статус не знайдено');

    await this.statusModel.findByIdAndDelete(id).exec();

    this.logger.log(
      `❌ Статус "${status.name}" видалено користувачем ${user.id}`,
    );
  }

  /**
   * 🛡 Перевіряє, чи є користувач адміністратором
   */
  private validateAdmin(user: any) {
    if (!user || user.role !== 'admin') {
      this.logger.warn(`🚫 Доступ заборонено для користувача ${user?.id}`);
      throw new ForbiddenException('Доступ заборонено');
    }
  }
}
