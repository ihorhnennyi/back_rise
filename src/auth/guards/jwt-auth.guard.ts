import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request) {
      this.logger.warn('❗️Запит не знайдено у контексті');
      throw new UnauthorizedException('Помилка запиту. Спробуйте ще раз.');
    }

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      this.logger.warn('❗️Токен відсутній або некоректний');
      throw new UnauthorizedException('Токен відсутній або некоректний');
    }

    const isActive = (await super.canActivate(context)) as boolean;

    if (!request.user) {
      this.logger.warn('❗️Аутентифікація не вдалася - користувача не знайдено');
      throw new UnauthorizedException('Аутентифікація не вдалася');
    }

    return isActive;
  }
}
