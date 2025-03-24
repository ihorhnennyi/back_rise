import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/schemas/user.schema';
import { CandidatesService } from './candidates.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { UpdateCandidateDto } from './dtos/update-candidate.dto';

@ApiTags('Кандидати')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Створити кандидата' })
  @ApiResponse({ status: 201, description: 'Кандидат успішно створений' })
  async createCandidate(
    @Body() dto: CreateCandidateDto,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.createCandidate(dto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати список кандидатів' })
  async getCandidates(@CurrentUser() user: User) {
    return this.candidatesService.findAllCandidates(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати одного кандидата' })
  async getCandidateById(
    @Param('id') candidateId: string,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.findCandidateById(candidateId, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Оновити кандидата' })
  async updateCandidate(
    @Param('id') candidateId: string,
    @Body() dto: UpdateCandidateDto,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.updateCandidate(candidateId, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Видалити кандидата' })
  async deleteCandidate(
    @Param('id') candidateId: string,
    @CurrentUser() user: User,
  ) {
    return this.candidatesService.deleteCandidate(candidateId, user);
  }

  @Post(':candidateId/assign/:recruiterId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Передати кандидата іншому рекрутеру (тільки адміністратор)',
  })
  async reassignCandidate(
    @Param('candidateId') candidateId: string,
    @Param('recruiterId') recruiterId: string,
    @CurrentUser() admin: User,
  ) {
    return this.candidatesService.reassignCandidate(
      candidateId,
      recruiterId,
      admin,
    );
  }
}
