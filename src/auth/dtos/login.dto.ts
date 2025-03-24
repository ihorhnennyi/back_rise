import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Email користувача',
  })
  @IsEmail({}, { message: 'Некоректний email' })
  email: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Пароль користувача',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Пароль є обов’язковим' })
  @MinLength(6, { message: 'Пароль повинен містити не менше 6 символів' })
  password: string;
}
