import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({ example: 'Київ', description: 'Назва міста' })
  @IsNotEmpty({ message: 'Назва міста обов’язкова' })
  @MinLength(2, { message: 'Назва міста має бути не менше 2 символів' })
  @MaxLength(50, { message: 'Назва міста має бути не більше 50 символів' })
  @Matches(/^[a-zA-Zа-яА-ЯіІїЇєЄ'’ -]+$/, {
    message: 'Назва міста може містити лише літери, пробіли та апострофи',
  })
  name: string;
}
