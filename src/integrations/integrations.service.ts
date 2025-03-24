import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { CreateIntegrationDto } from './dtos/create-integration.dto';
import { UpdateIntegrationDto } from './dtos/update-integration.dto';
import { Integration } from './schemas/integration.schema';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectModel(Integration.name) private integrationModel: Model<Integration>,
    private readonly usersService: UsersService, // ✅ Используем UsersService
  ) {}

  /**
   * ✅ Створення нової інтеграції
   */
  async create(dto: CreateIntegrationDto, user: any): Promise<Integration> {
    this.validateAdmin(user);

    if (!isValidObjectId(user.id)) {
      throw new BadRequestException('Некоректний ID користувача');
    }

    const createdBy = new Types.ObjectId(user.id);

    const integration = await this.integrationModel.create({
      name: dto.name,
      url: dto.url,
      createdBy,
    });

    await this.usersService.addCreatedEntity(
      user.id,
      integration.id.toString(),
      'integration',
    );

    return integration.populate('createdBy');
  }

  async findAll(): Promise<Integration[]> {
    return this.integrationModel
      .find()
      .populate('createdBy', 'email role')
      .exec();
  }

  /**
   * ✅ Отримання інтеграції за ID
   */
  async findOne(id: string): Promise<Integration> {
    this.validateObjectId(id, 'Некоректний ID інтеграції');

    const integration = await this.integrationModel
      .findById(id)
      .populate('createdBy', 'email role')
      .exec();

    if (!integration) {
      throw new NotFoundException('Інтеграцію не знайдено');
    }

    return integration;
  }

  /**
   * ✅ Оновлення інтеграції
   */
  async update(
    id: string,
    dto: UpdateIntegrationDto,
    user: any,
  ): Promise<Integration> {
    this.validateAdmin(user);
    this.validateObjectId(id, 'Некоректний ID інтеграції');

    const integration = await this.integrationModel.findById(id).exec();
    if (!integration) {
      throw new NotFoundException('Інтеграцію не знайдено');
    }

    Object.assign(integration, dto);
    await integration.save();

    return integration.populate('createdBy');
  }

  /**
   * ✅ Видалення інтеграції
   */
  async delete(id: string, user: any): Promise<void> {
    this.validateAdmin(user);
    this.validateObjectId(id, 'Некоректний ID інтеграції');

    const integration = await this.integrationModel.findById(id).exec();
    if (!integration) {
      throw new NotFoundException('Інтеграцію не знайдено');
    }

    await this.integrationModel.findByIdAndDelete(id).exec();

    // ✅ Видаляємо інтеграцію у списку створених у адміна
    await this.usersService.removeCreatedEntity(user.id, id, 'integration');
  }

  /**
   * 🛡 Перевіряє, чи є користувач адміністратором
   */
  private validateAdmin(user: any) {
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Доступ заборонено');
    }
  }

  /**
   * 🔍 Перевіряє коректність ObjectId
   */
  private validateObjectId(id: string, errorMessage: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(errorMessage);
    }
  }
}
