import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // ✅ Якщо ролі не вимагаються, пропускаємо далі
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      this.logger.warn('❗️ Користувач не авторизований або роль відсутня');
      throw new UnauthorizedException('Користувач не авторизований');
    }

    if (!requiredRoles.includes(user.role as UserRole)) {
      this.logger.warn(
        `🚫 Доступ заборонено: користувач з роллю ${user.role} не має дозволу`,
      );
      throw new ForbiddenException(
        `Доступ заборонено: потрібна одна з ролей: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
