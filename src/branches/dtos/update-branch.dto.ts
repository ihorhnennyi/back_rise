import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateBranchDto {
  @ApiProperty({ example: 'Новий офіс', description: 'Нова назва філії' })
  @IsString({ message: 'Назва філії має бути текстовим значенням' })
  @IsOptional()
  @MinLength(2, { message: 'Назва філії має бути не менше 2 символів' })
  @MaxLength(50, { message: 'Назва філії має бути не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва філії може містити лише літери, пробіли та апострофи',
  })
  name?: string;

  @ApiProperty({
    example: '652c5c7a7c9e4e3b2a7a72b5',
    description: 'Новий ID міста',
  })
  @IsMongoId({ message: 'Некоректний ID міста' })
  @IsOptional()
  city?: string;
}
