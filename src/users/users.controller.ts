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
import { UserRole } from '../auth/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Користувачі')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити рекрутера (тільки адміністратор)' })
  @ApiResponse({ status: 201, description: 'Рекрутер успішно створений' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  async create(@Body() dto: CreateUserDto, @Request() req) {
    return this.usersService.createRecruiter(dto, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всіх користувачів' })
  @ApiResponse({
    status: 200,
    description: 'Список користувачів успішно отримано',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати користувача за ID' })
  @ApiResponse({ status: 200, description: 'Користувач знайдений' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити користувача (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Користувач успішно оновлений' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити користувача (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Користувач успішно видалений' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Get(':id/created-cities')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем міста' })
  async getCreatedCities(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdCities ?? [];
  }

  @Get(':id/created-branches')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем філії' })
  async getCreatedBranches(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdBranches ?? [];
  }

  @Get(':id/created-statuses')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем статуси' })
  async getCreatedStatuses(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdStatuses ?? [];
  }

  @Get(':id/created-integrations')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем інтеграції' })
  async getCreatedIntegrations(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdIntegrations ?? [];
  }

  @Get(':id/created-users')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Отримати всіх користувачів, створених адміністратором',
  })
  async getCreatedUsers(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdUsers ?? [];
  }

  @Get(':id/entities')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем сутності' })
  async getUserEntities(@Param('id') id: string) {
    return this.usersService.getUserEntities(id);
  }

  @Get(':id/created-sources')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всі створені користувачем джерела' })
  async getCreatedSources(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdSources ?? [];
  }

  @Get(':id/created-candidates')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Отримати всіх створених кандидатом' })
  async getCreatedCandidates(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    return user?.createdCandidates ?? [];
  }
}
