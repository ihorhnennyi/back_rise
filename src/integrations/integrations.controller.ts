import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
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
import { CreateIntegrationDto } from './dtos/create-integration.dto';
import { UpdateIntegrationDto } from './dtos/update-integration.dto';
import { IntegrationsService } from './integrations.service';

@ApiTags('Інтеграції')
@Controller('integrations')
export class IntegrationsController {
  private readonly logger = new Logger(IntegrationsController.name);

  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Створити інтеграцію (тільки адміністратор)' })
  @ApiResponse({ status: 201, description: 'Інтеграцію успішно створено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  async create(@Body() dto: CreateIntegrationDto, @Req() req) {
    this.logger.log(`📌 Створення інтеграції користувачем ${req.user.id}`);
    return this.integrationsService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі інтеграції' })
  @ApiResponse({
    status: 200,
    description: 'Список інтеграцій успішно отримано',
  })
  async findAll() {
    return this.integrationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати інтеграцію за ID' })
  @ApiResponse({ status: 200, description: 'Інтеграцію знайдено' })
  @ApiResponse({ status: 404, description: 'Інтеграцію не знайдено' })
  async findOne(@Param('id') id: string) {
    return this.integrationsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Оновити інтеграцію (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Інтеграцію успішно оновлено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Інтеграцію не знайдено' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateIntegrationDto,
    @Req() req,
  ) {
    this.logger.log(
      `✏️ Оновлення інтеграції ${id} користувачем ${req.user.id}`,
    );
    return this.integrationsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Видалити інтеграцію (тільки адміністратор)' })
  @ApiResponse({ status: 200, description: 'Інтеграцію успішно видалено' })
  @ApiResponse({ status: 403, description: 'Доступ заборонено' })
  @ApiResponse({ status: 404, description: 'Інтеграцію не знайдено' })
  async remove(@Param('id') id: string, @Req() req) {
    this.logger.log(
      `❌ Видалення інтеграції ${id} користувачем ${req.user.id}`,
    );
    return this.integrationsService.delete(id, req.user);
  }
}
