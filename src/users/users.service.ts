import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Candidate } from 'src/candidates/schemas/candidate.schema';
import { UserRole } from '../auth/enums/user-role.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>, //
  ) {}

  /**
   * 🔹 Найти пользователя по email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * 🔹 Найти пользователя по ID
   */
  async findOneById(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний формат ID користувача');
    }

    const user = await this.userModel
      .findById(id)
      .populate('createdCities')
      .populate('createdBranches')
      .populate('createdStatuses')
      .populate('createdIntegrations')
      .populate('createdUsers', 'firstName lastName email role status'); // ✅ Теперь админ видит созданных пользователей

    if (!user) {
      this.logger.warn(`❌ Користувача з ID ${id} не знайдено`);
      throw new NotFoundException('Користувача не знайдено');
    }

    return user;
  }

  /**
   * 🔹 Получить всех рекрутеров
   */
  async findAllRecruiters(): Promise<User[]> {
    return this.userModel.find({ role: UserRole.RECRUITER }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getCandidatesForUser(user: User): Promise<Candidate[]> {
    if (user.role === UserRole.ADMIN) {
      // Админ получает всех кандидатов
      return this.candidateModel.find().populate('createdBy assignedTo').exec();
    }
    // Рекрутер видит только своих кандидатов
    return this.candidateModel.find({ assignedTo: user.id }).exec();
  }

  /**
   * 🔹 Создать администратора
   */
  async createAdmin(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      role: UserRole.ADMIN, // Принудительно задаем роль
    });

    this.logger.log(`✅ Адміністратор ${admin.email} створений`);

    return admin;
  }

  /**
   * 🔹 Создать рекрутера (только админ)
   */
  async createRecruiter(dto: CreateUserDto, admin: User): Promise<User> {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Тільки адміністратор може створювати рекрутерів.',
      );
    }

    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Користувач з таким email вже існує');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.userModel
      .create({
        ...dto,
        password: hashedPassword,
        createdBy: new Types.ObjectId(admin.id),
      })
      .then((user) => user.toObject() as User & { _id: Types.ObjectId }); // 👈 Принудительно указываем _id

    await this.addCreatedEntity(admin.id, newUser._id.toString(), 'user');

    this.logger.log(
      `✅ Рекрутер ${newUser.email} створений адміністратором ${admin.email}`,
    );

    return newUser;
  }

  /**
   * 🔹 Обновить пользователя (только админ)
   */
  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний формат ID користувача');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    // Хешируем пароль, если он передан
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    // Обновляем только переданные поля
    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined) {
        user[key] = dto[key];
      }
    });

    await user.save();

    this.logger.log(`🛠️ Користувач ${user.email} оновлений`);

    return user;
  }

  /**
   * 🔹 Удалить пользователя (только админ)
   */
  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний формат ID користувача');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    await this.userModel.findByIdAndDelete(id).exec();
    this.logger.log(`❌ Користувач ${user.email} видалений`);
  }

  /**
   * 🔹 Добавить сущность в список созданных пользователем
   */
  async addCreatedEntity(userId: string, entityId: string, entityType: string) {
    if (!isValidObjectId(userId) || !isValidObjectId(entityId)) {
      throw new BadRequestException('Некоректний формат ID');
    }

    let updateField;
    switch (entityType) {
      case 'city':
        updateField = {
          $push: { createdCities: new Types.ObjectId(entityId) },
        };
        break;
      case 'branch':
        updateField = {
          $push: { createdBranches: new Types.ObjectId(entityId) },
        };
        break;
      case 'status':
        updateField = {
          $push: { createdStatuses: new Types.ObjectId(entityId) },
        };
        break;
      case 'integration':
        updateField = {
          $push: { createdIntegrations: new Types.ObjectId(entityId) },
        };
        break;
      case 'user': // ✅ Теперь можно добавлять пользователей
        updateField = { $push: { createdUsers: new Types.ObjectId(entityId) } };
        break;
      default:
        throw new BadRequestException(
          `Непідтримуваний тип сутності: ${entityType}`,
        );
    }

    await this.userModel.findByIdAndUpdate(userId, updateField, { new: true });
  }

  /**
   * 🔹 Удалить сущность из списка созданных пользователем
   */
  async removeCreatedEntity(
    userId: string,
    entityId: string,
    entityType: string,
  ) {
    if (!isValidObjectId(userId) || !isValidObjectId(entityId)) {
      throw new BadRequestException('Некоректний формат ID');
    }

    let updateField;
    switch (entityType) {
      case 'city':
        updateField = {
          $pull: { createdCities: new Types.ObjectId(entityId) },
        };
        break;
      case 'branch':
        updateField = {
          $pull: { createdBranches: new Types.ObjectId(entityId) },
        };
        break;
      case 'status':
        updateField = {
          $pull: { createdStatuses: new Types.ObjectId(entityId) },
        };
        break;
      case 'integration':
        updateField = {
          $pull: { createdIntegrations: new Types.ObjectId(entityId) },
        };
        break;
      case 'user': // ✅ Теперь можно удалять пользователей
        updateField = { $pull: { createdUsers: new Types.ObjectId(entityId) } };
        break;
      default:
        throw new BadRequestException(
          `Непідтримуваний тип сутності: ${entityType}`,
        );
    }

    await this.userModel.findByIdAndUpdate(userId, updateField, { new: true });
  }

  /**
   * 🔹 Получить все сущности, созданные пользователем
   */
  async getUserEntities(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний формат ID користувача');
    }

    const user = await this.findOneById(id);
    return {
      createdCities: user.createdCities ?? [],
      createdBranches: user.createdBranches ?? [],
      createdStatuses: user.createdStatuses ?? [],
      createdIntegrations: user.createdIntegrations ?? [],
      createdUsers: user.createdUsers ?? [], // ✅ Теперь список созданных пользователей доступен
    };
  }
}
