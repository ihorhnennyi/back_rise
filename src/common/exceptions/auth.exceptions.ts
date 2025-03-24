import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Користувача не знайдено');
  }
}

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super('Невірний email або пароль');
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Недійсний refresh token');
  }
}

export class EmailAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Користувач з таким email вже існує');
  }
}
