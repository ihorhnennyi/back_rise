import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ example: 'Неактивний', description: 'Нова назва статусу' })
  @IsString({ message: 'Назва статусу має бути текстовим значенням' })
  @MinLength(2, { message: 'Назва статусу має бути не менше 2 символів' })
  @MaxLength(50, { message: 'Назва статусу має бути не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва статусу може містити лише літери, пробіли та апострофи',
  })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '#3366FF', description: 'Новий колір статусу' })
  @IsString({ message: 'Колір статусу має бути текстовим значенням' })
  @Matches(/^#([0-9A-Fa-f]{6})$/, {
    message: 'Колір статусу має бути у форматі HEX (наприклад, #FF5733)',
  })
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b5',
    description: 'Новий ID користувача, який створив статус',
  })
  @IsMongoId({ message: 'Некоректний ID користувача' })
  @IsOptional()
  createdBy?: string;
}
