import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: 'Активний', description: 'Назва статусу' })
  @IsString({ message: 'Назва статусу має бути текстовим значенням' })
  @IsNotEmpty({ message: 'Назва статусу обов’язкова' })
  @MinLength(2, { message: 'Назва статусу має бути не менше 2 символів' })
  @MaxLength(50, { message: 'Назва статусу має бути не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва статусу може містити лише літери, пробіли та апострофи',
  })
  name: string;

  @ApiProperty({ example: '#FF5733', description: 'Колір статусу' })
  @IsString({ message: 'Колір статусу має бути текстовим значенням' })
  @Matches(/^#([0-9A-Fa-f]{6})$/, {
    message: 'Колір статусу має бути у форматі HEX (наприклад, #FF5733)',
  })
  @IsNotEmpty({ message: 'Колір статусу обов’язковий' })
  color: string;
}
