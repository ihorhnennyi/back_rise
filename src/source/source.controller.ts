import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserRole } from 'src/auth/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateSourceDto } from './dtos/create-source.dto';
import { UpdateSourceDto } from './dtos/update-source.dto';
import { SourcesService } from './source.service';

@ApiTags('Джерела')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити джерело (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Джерело успішно створено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateSourceDto, @Request() req) {
    return this.sourcesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі джерела' })
  @ApiResponse({ status: 200, description: 'Список джерел успішно отримано' })
  async findAll() {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати джерело за ID' })
  @ApiResponse({ status: 200, description: 'Джерело знайдено' })
  @ApiResponse({ status: 404, description: 'Джерело не знайдено' })
  async findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити джерело (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Джерело успішно оновлено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Джерело не знайдено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSourceDto,
    @Request() req,
  ) {
    return this.sourcesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити джерело (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Джерело успішно видалено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Джерело не знайдено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    return this.sourcesService.remove(id, req.user);
  }
}
