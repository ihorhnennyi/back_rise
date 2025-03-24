import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Иван', description: 'Имя', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

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
    example: 'user@example.com',
    description: 'Email',
    required: false,
  })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsOptional()
  email?: string;

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
    items: {
      type: 'object',
      properties: {
        integrationId: { type: 'string', format: 'mongoId' },
        login: { type: 'string' },
        password: { type: 'string' },
      },
    },
    required: false,
  })
  @IsArray()
  @IsOptional()
  integrationCredentials?: {
    integrationId: string;
    login: string;
    password: string;
  }[];

  @ApiProperty({
    example: 'NewPassword123',
    description: 'Новый пароль',
    required: false,
  })
  @MinLength(8, { message: 'Пароль должен содержать не менее 8 символов' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Пароль должен содержать хотя бы одну заглавную букву и цифру',
  })
  @IsOptional()
  password?: string;
}
