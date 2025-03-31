import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCityDto {
  @ApiPropertyOptional({
    example: 'Львів',
    description: 'Оновлена назва міста',
  })
  @IsOptional()
  @IsString({ message: 'Назва має бути текстом' })
  @MinLength(2, { message: 'Мінімум 2 символи' })
  @MaxLength(50, { message: 'Максимум 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва може містити лише літери, пробіли та апострофи',
  })
  name?: string;
}
