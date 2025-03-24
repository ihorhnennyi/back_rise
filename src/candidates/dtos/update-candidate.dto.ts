import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCandidateDto {
  @ApiProperty({ example: 'Іван', description: "Ім'я", required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Петров', description: 'Прізвище', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Іванович',
    description: 'По батькові',
    required: false,
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: 25, description: 'Вік', required: false })
  @IsNumber()
  @Min(18)
  @IsOptional()
  age?: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email',
    required: false,
  })
  @IsEmail()
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
    example: 'https://example.com/photo.jpg',
    description: 'Фото профілю',
    required: false,
  })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({
    example: 'Досвід роботи 3 роки',
    description: 'Опис',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b5',
    description: 'ID міста',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: '1000', description: 'Зарплата', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salary?: number;

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b6',
    description: 'ID статусу',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Дата завершення статусу',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;
}
