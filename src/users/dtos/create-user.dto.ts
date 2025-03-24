import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../auth/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван', description: 'Имя' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Password123', description: 'Пароль', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
  })
  password: string;

  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'Роль пользователя',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ example: 'Петров', description: 'Фамилия', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Иванович',
    description: 'Отчество',
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Дата рождения',
    required: false,
  })
  @IsOptional()
  birthDate?: string;

  @ApiProperty({
    example: '+380991234567',
    description: 'Телефон',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'telegram_username',
    description: 'Telegram',
    required: false,
  })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({
    example: 'viber_number',
    description: 'Viber',
    required: false,
  })
  @IsString()
  @IsOptional()
  viber?: string;

  @ApiProperty({
    example: 'whatsapp_number',
    description: 'WhatsApp',
    required: false,
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Фото профиля',
    required: false,
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({
    example: 'Рекрутер с 5-летним опытом',
    description: 'Комментарий',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    example: 'active',
    description: 'Статус пользователя',
    enum: ['active', 'inactive'],
    required: false,
  })
  @IsString()
  @IsEnum(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b5',
    description: 'ID города',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b6',
    description: 'ID филиала',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  branch?: string;

  @ApiProperty({
    example: ['652c5c7a7c9e4e3b2a7a72b7'],
    description: 'Список ID интеграций',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  integrations?: string[];

  @ApiProperty({
    example: [
      {
        integrationId: '652c5c7a7c9e4e3b2a7a72b8',
        login: 'user',
        password: 'pass123',
      },
    ],
    description: 'Логины и пароли для интеграций',
    type: 'array',
    required: false,
  })
  @IsArray()
  @IsOptional()
  integrationCredentials?: {
    integrationId: string;
    login: string;
    password: string;
  }[];
}
