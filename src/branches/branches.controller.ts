import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '../auth/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dtos/create-branch.dto';
import { UpdateBranchDto } from './dtos/update-branch.dto';

@ApiTags('Філії')
@Controller('branches')
export class BranchesController {
  private readonly logger = new Logger(BranchesController.name);

  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити філію (тільки адміністратор)' })
  @ApiResponse({ status: 201, description: 'Філія успішно створена' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  async create(@Body() dto: CreateBranchDto, @Request() req) {
    this.logger.log(`📌 Створення філії користувачем ${req.user.id}`);
    return this.branchesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі філії' })
  @ApiResponse({ status: 200, description: 'Список філій успішно отримано' })
  async findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати філію за ID' })
  @ApiResponse({ status: 200, description: 'Філія знайдена' })
  @ApiResponse({ status: 404, description: 'Філія не знайдена' })
  async findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити філію (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Філія успішно оновлена' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Філія не знайдена' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
    @Request() req,
  ) {
    this.logger.log(`📌 Оновлення філії ${id} користувачем ${req.user.id}`);
    return this.branchesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити філію (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Філія успішно видалена' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Філія не знайдена' })
  async remove(@Param('id') id: string, @Request() req) {
    this.logger.log(`❌ Видалення філії ${id} користувачем ${req.user.id}`);
    return this.branchesService.delete(id, req.user);
  }
}
