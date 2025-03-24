import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { City } from '../cities/schemas/city.schema';
import { UsersService } from '../users/users.service';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';
import { Branch } from './schemas/branch.schema';

@Injectable()
export class BranchesService {
  private readonly logger = new Logger(BranchesService.name);

  constructor(
    @InjectModel(Branch.name) private branchModel: Model<Branch>,
    @InjectModel(City.name) private cityModel: Model<City>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateBranchDto, user: any): Promise<Branch> {
    this.validateAdmin(user);

    if (!isValidObjectId(user.id)) {
      throw new BadRequestException('Некоректний ID користувача');
    }
    if (!isValidObjectId(dto.city)) {
      throw new BadRequestException('Некоректний ID міста');
    }

    const cityExists = await this.cityModel.exists({ _id: dto.city });
    if (!cityExists) {
      throw new NotFoundException('Місто не знайдено');
    }

    const createdBy = new Types.ObjectId(user.id);
    const branch = await this.branchModel.create({
      name: dto.name,
      city: new Types.ObjectId(dto.city),
      createdBy,
    });

    if (!branch._id) {
      throw new Error('Помилка створення філії');
    }

    this.logger.log(`✅ Філія ${branch._id} створена користувачем ${user.id}`);

    await this.usersService.addCreatedEntity(
      user.id,
      branch._id.toString(),
      'branch',
    );

    return branch.populate('city createdBy');
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().populate('city createdBy').exec();
  }

  async findOne(id: string): Promise<Branch> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID філії');
    }

    const branch = await this.branchModel
      .findById(id)
      .populate('city createdBy')
      .exec();
    if (!branch) throw new NotFoundException('Філію не знайдено');

    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, user: any): Promise<Branch> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID філії');
    }

    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException('Філію не знайдено');
    }

    if (branch.createdBy.toString() !== user.id) {
      throw new ForbiddenException('Ви можете оновлювати тільки свої філії');
    }

    Object.assign(branch, dto);
    await branch.save();

    this.logger.log(`✅ Філія ${id} оновлена користувачем ${user.id}`);

    return branch.populate('city createdBy');
  }

  async delete(id: string, user: any): Promise<void> {
    this.validateAdmin(user);

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Некоректний ID філії');
    }

    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException('Філію не знайдено');
    }

    if (branch.createdBy.toString() !== user.id) {
      throw new ForbiddenException('Ви можете видаляти тільки свої філії');
    }

    await this.branchModel.findByIdAndDelete(id).exec();
    await this.usersService.removeCreatedEntity(user.id, id, 'branch');

    this.logger.log(`❌ Філія ${id} видалена користувачем ${user.id}`);
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
