import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class UpdateIntegrationDto {
  @ApiProperty({
    example: 'Google API',
    description: 'Нова назва інтеграції',
    required: false,
  })
  @IsString({ message: 'Назва має бути рядком' })
  @IsOptional()
  @MinLength(3, { message: 'Назва має містити щонайменше 3 символи' })
  name?: string;

  @ApiProperty({
    example: 'https://api.google.com',
    description: 'Нове посилання на інтеграцію',
    required: false,
  })
  @IsUrl({}, { message: 'Некоректне посилання' })
  @IsOptional()
  url?: string;
}
