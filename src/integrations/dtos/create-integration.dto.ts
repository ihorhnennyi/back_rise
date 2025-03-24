import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateIntegrationDto {
  @ApiProperty({ example: 'Google API', description: 'Назва інтеграції' })
  @IsString({ message: 'Назва має бути рядком' })
  @IsNotEmpty({ message: 'Назва інтеграції є обов’язковою' })
  @MinLength(3, { message: 'Назва має містити щонайменше 3 символи' })
  name: string;

  @ApiProperty({
    example: 'https://api.google.com',
    description: 'Посилання на інтеграцію',
  })
  @IsUrl({}, { message: 'Некоректне посилання' })
  @IsNotEmpty({ message: 'Посилання на інтеграцію є обов’язковим' })
  url: string;
}
