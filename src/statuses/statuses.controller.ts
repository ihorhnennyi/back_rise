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
import { CreateStatusDto } from './dtos/create-status.dto';
import { UpdateStatusDto } from './dtos/update-status.dto';
import { StatusesService } from './statuses.service';

@ApiTags('Статуси')
@Controller('statuses')
export class StatusesController {
  private readonly logger = new Logger(StatusesController.name);

  constructor(private readonly statusesService: StatusesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити статус (тільки адміністратор)' })
  @ApiResponse({ status: 201, description: 'Статус успішно створено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  async create(@Body() dto: CreateStatusDto, @Request() req) {
    this.logger.log(`📌 Створення статусу користувачем ${req.user.id}`);
    return this.statusesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі статуси' })
  @ApiResponse({ status: 200, description: 'Список статусів успішно отримано' })
  async findAll() {
    return this.statusesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати статус за ID' })
  @ApiResponse({ status: 200, description: 'Статус знайдено' })
  @ApiResponse({ status: 404, description: 'Статус не знайдено' })
  async findOne(@Param('id') id: string) {
    return this.statusesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити статус (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Статус успішно оновлено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Статус не знайдено' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Request() req,
  ) {
    this.logger.log(`✏️ Оновлення статусу ${id} користувачем ${req.user.id}`);
    return this.statusesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити статус (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Статус успішно видалено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Статус не знайдено' })
  async remove(@Param('id') id: string, @Request() req) {
    this.logger.log(`❌ Видалення статусу ${id} користувачем ${req.user.id}`);
    return this.statusesService.delete(id, req.user);
  }
}
