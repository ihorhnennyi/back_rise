import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSourceDto {
  @ApiProperty({ example: 'Instagram', description: 'Назва джерела' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва може містити лише літери, пробіли та апострофи',
  })
  name: string;
}
