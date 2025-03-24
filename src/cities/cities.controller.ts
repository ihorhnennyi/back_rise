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
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dtos/create-city.dto';
import { UpdateCityDto } from './dtos/update-city.dto';

@ApiTags('Міста')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Створити місто (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Місто успішно створено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateCityDto, @Request() req) {
    return this.citiesService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі міста' })
  @ApiResponse({ status: 200, description: 'Список міст успішно отримано' })
  async findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати місто за ID' })
  @ApiResponse({ status: 200, description: 'Місто знайдено' })
  @ApiResponse({ status: 404, description: 'Місто не знайдено' })
  async findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити місто (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Місто успішно оновлено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Місто не знайдено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCityDto,
    @Request() req,
  ) {
    return this.citiesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити місто (тільки адміністратор)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Місто успішно видалене' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Місто не знайдено' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Request() req) {
    return this.citiesService.remove(id, req.user);
  }
}
