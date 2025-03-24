import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Змінна середовища JWT_SECRET не встановлена!');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      if (!payload || !payload.id) {
        this.logger.warn(`Невалідний токен: ${JSON.stringify(payload)}`);
        throw new UnauthorizedException('Недійсний токен');
      }

      return { id: payload.id, email: payload.email, role: payload.role };
    } catch (error) {
      this.logger.error(`Помилка при валідації токена: ${error.message}`);
      throw error;
    }
  }
}
