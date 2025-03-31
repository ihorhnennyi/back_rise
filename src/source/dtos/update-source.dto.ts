import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateSourceDto {
  @ApiProperty({ example: 'Facebook', description: 'Оновлена назва джерела' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва може містити лише літери, пробіли та апострофи',
  })
  name?: string;
}
