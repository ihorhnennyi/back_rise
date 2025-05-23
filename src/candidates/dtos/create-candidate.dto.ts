import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateCandidateDto {
  @ApiProperty({ example: 'Іван', description: "Ім'я" })
  @IsString()
  @IsNotEmpty({ message: 'Ім’я є обовʼязковим' })
  firstName: string;

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

  @ApiProperty({ example: 'user@example.com', description: 'Email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+380991234567', description: 'Телефон' })
  @IsString()
  @IsNotEmpty({ message: 'Телефон є обовʼязковим' })
  phone: string;

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
  @IsOptional()
  @Matches(/^[a-fA-F0-9]{24}$|^$/, { message: 'Некорректний ID міста' })
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
  @IsOptional()
  @Matches(/^[a-fA-F0-9]{24}$|^$/, { message: 'Некорректний ID статусу' })
  status?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Дата завершення статусу',
    required: false,
  })
  @IsOptional()
  expirationDate?: Date;

  @ApiProperty({
    example: '67df0e6d2f4911da98e864',
    description: 'ID рекрутера',
    required: false,
  })
  @IsOptional()
  @IsMongoId({ message: 'Некорректний ID рекрутера' })
  recruiterId?: string;

  @ApiProperty({
    example: 'sourceObjectId',
    description: 'ID джерела',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  source?: string;
}
