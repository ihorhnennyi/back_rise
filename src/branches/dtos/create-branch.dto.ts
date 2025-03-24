import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Головний офіс', description: 'Назва філії' })
  @IsString({ message: 'Назва філії має бути текстовим значенням' })
  @IsNotEmpty({ message: 'Назва філії обов’язкова' })
  @MinLength(2, { message: 'Назва філії має бути не менше 2 символів' })
  @MaxLength(50, { message: 'Назва філії має бути не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва філії може містити лише літери, пробіли та апострофи',
  })
  name: string;

  @ApiProperty({ example: '652c5c7a7c9e4e3b2a7a72b5', description: 'ID міста' })
  @IsMongoId({ message: 'Некоректний ID міста' })
  city: string;
}
