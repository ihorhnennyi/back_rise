import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

/**
 * 📝 DTO для реєстрації користувача
 */
export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email користувача',
  })
  @IsEmail({}, { message: 'Некоректний email' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Пароль користувача',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Пароль є обов’язковим' })
  @MinLength(8, { message: 'Пароль повинен містити не менше 8 символів' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Пароль повинен містити хоча б одну велику літеру та цифру',
  })
  password: string;

  @ApiProperty({
    example: 'recruiter',
    description: 'Роль користувача (admin або recruiter)',
    enum: UserRole,
  })
  @IsEnum(UserRole, { message: 'Роль повинна бути admin або recruiter' })
  role: UserRole;
}
