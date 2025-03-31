import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { UserRole } from '../auth/enums/user-role.enum';
import { User } from '../users/schemas/user.schema';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { UpdateCandidateDto } from './dtos/update-candidate.dto';
import { Candidate } from './schemas/candidate.schema';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createCandidate(
    dto: CreateCandidateDto,
    user: User,
  ): Promise<Candidate> {
    const newCandidate = new this.candidateModel({
      ...dto,
      createdBy: new Types.ObjectId(user.id),
      assignedTo: new Types.ObjectId(user.id),
      source: dto.source ? new Types.ObjectId(dto.source) : undefined,
      statusHistory: dto.expirationDate
        ? [
            {
              status: new Types.ObjectId(dto.status),
              expirationDate: dto.expirationDate,
            },
          ]
        : [{ status: new Types.ObjectId(dto.status) }],
    });

    const savedCandidate = await newCandidate.save();

    await this.userModel.findByIdAndUpdate(user.id, {
      $push: { createdCandidates: savedCandidate._id },
    });

    return savedCandidate;
  }

  async updateCandidate(
    candidateId: string,
    dto: UpdateCandidateDto,
    user: User,
  ): Promise<Candidate> {
    if (!isValidObjectId(candidateId)) {
      throw new NotFoundException('Некоректний ID кандидата');
    }

    const candidate = await this.candidateModel.findById(candidateId);
    if (!candidate) {
      throw new NotFoundException('Кандидат не знайдений');
    }

    if (
      user.role !== UserRole.ADMIN &&
      candidate.createdBy.toString() !== user.id
    ) {
      throw new ForbiddenException('Ви не можете редагувати цього кандидата');
    }

    Object.assign(candidate, dto);

    if (dto.status) {
      candidate.status = new Types.ObjectId(dto.status);
      candidate.statusHistory.push({
        status: new Types.ObjectId(dto.status),
        expirationDate: dto.expirationDate
          ? new Date(dto.expirationDate)
          : undefined,
      });
    }

    return candidate.save();
  }

  async findAllCandidates(user: User): Promise<Candidate[]> {
    return this.candidateModel.find().populate('createdBy assignedTo').exec();
  }

  async findCandidateById(candidateId: string, user: User): Promise<Candidate> {
    if (!isValidObjectId(candidateId)) {
      throw new NotFoundException('Некоректний ID кандидата');
    }

    const candidate = await this.candidateModel
      .findById(candidateId)
      .populate('createdBy assignedTo');

    if (!candidate) {
      throw new NotFoundException('Кандидат не знайдений');
    }
    const isAdmin = user.role === UserRole.ADMIN;

    const assignedTo = candidate.assignedTo as any;

    const assignedToId =
      typeof assignedTo === 'object' && assignedTo !== null
        ? assignedTo._id?.toString()
        : assignedTo?.toString();

    const isOwner = assignedToId === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('Ви не маєте доступу до цього кандидата');
    }

    return candidate;
  }

  async deleteCandidate(candidateId: string, user: User): Promise<void> {
    if (!isValidObjectId(candidateId)) {
      throw new NotFoundException('Некоректний ID кандидата');
    }

    const candidate = await this.candidateModel.findById(candidateId);
    if (!candidate) {
      throw new NotFoundException('Кандидат не знайдений');
    }

    if (
      user.role !== UserRole.ADMIN &&
      candidate.createdBy.toString() !== user.id
    ) {
      throw new ForbiddenException('Ви не можете видалити цього кандидата');
    }

    await this.userModel.findByIdAndUpdate(candidate.createdBy, {
      $pull: { createdCandidates: candidate._id },
    });

    await this.candidateModel.findByIdAndDelete(candidateId);
  }

  async reassignCandidate(
    candidateId: string,
    recruiterId: string,
    admin: User,
  ): Promise<Candidate> {
    if (admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Тільки адміністратор може передавати кандидатів',
      );
    }

    if (!isValidObjectId(candidateId) || !isValidObjectId(recruiterId)) {
      throw new NotFoundException('Некоректні ID кандидата або рекрутера');
    }

    const candidate = await this.candidateModel.findById(candidateId);
    if (!candidate) {
      throw new NotFoundException('Кандидат не знайдений');
    }

    const oldRecruiterId = candidate.assignedTo?.toString();

    candidate.assignedTo = new Types.ObjectId(recruiterId);
    await candidate.save();

    if (oldRecruiterId) {
      await this.userModel.findByIdAndUpdate(oldRecruiterId, {
        $pull: { createdCandidates: candidate._id },
      });
    }

    await this.userModel.findByIdAndUpdate(recruiterId, {
      $push: { createdCandidates: candidate._id },
    });

    return candidate;
  }
}
