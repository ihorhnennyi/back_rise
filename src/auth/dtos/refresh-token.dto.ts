import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'your-refresh-token',
    description: 'Refresh-токен користувача',
  })
  @IsNotEmpty({ message: 'Токен є обов’язковим' })
  refresh_token: string;
}
