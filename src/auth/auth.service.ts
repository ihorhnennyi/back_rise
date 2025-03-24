import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './schemas/refresh-token.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async registerAdmin(dto: CreateUserDto) {
    try {
      const admin = await this.usersService.createAdmin(dto);

      this.logger.log(`✅ Адміністратор ${admin.email} успішно зареєстрований`);

      return this.generateTokens(admin);
    } catch (error) {
      this.logger.error(
        `❌ Помилка реєстрації адміністратора: ${error.message}`,
      );
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.warn(`Спроба входу з неіснуючим email: ${email}`);
        throw new UnauthorizedException('Невірний email або пароль');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Невдала спроба входу: ${email}`);
        throw new UnauthorizedException('Невірний email або пароль');
      }

      // Видаляємо лише прострочені токени, а не всі підряд
      await this.refreshTokenModel.deleteMany({
        userId: user._id,
        expiresAt: { $lt: new Date() },
      });

      return this.generateTokens(user);
    } catch (error) {
      this.logger.error(`Помилка входу: ${error.message}`);
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Токен відсутній');
      }

      const existingToken = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });

      if (!existingToken) {
        throw new UnauthorizedException('Недійсний токен');
      }

      // Перевіряємо термін дії refresh-токена
      if (new Date(existingToken.expiresAt) < new Date()) {
        this.logger.warn(`Прострочений refresh-токен: ${refreshToken}`);
        await this.refreshTokenModel.deleteOne({ token: refreshToken });
        throw new UnauthorizedException('Refresh-токен прострочений');
      }

      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.usersService.findOneById(payload.id);

      if (!user) {
        this.logger.warn(`Спроба оновлення токена неіснуючого користувача`);
        throw new UnauthorizedException('Користувача не знайдено');
      }

      return this.generateTokens(user);
    } catch (error) {
      this.logger.error(`Помилка при оновленні токена: ${error.message}`);
      throw error;
    }
  }

  async logout(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new BadRequestException('Токен відсутній');
      }

      await this.refreshTokenModel.deleteOne({ token: refreshToken });
      this.logger.log(`Користувач вийшов із системи`);
      return { message: 'Вихід виконано' };
    } catch (error) {
      this.logger.error(`Помилка при виході: ${error.message}`);
      throw error;
    }
  }

  async generateTokens(user: User) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('Змінна середовища JWT_SECRET не встановлена!');
      }

      const payload = { id: user._id, email: user.email, role: user.role };

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

      await this.refreshTokenModel.create({
        token: refreshToken,
        userId: user._id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      this.logger.log(`Видано новий токен для користувача: ${user.email}`);

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      this.logger.error(`Помилка при генерації токенів: ${error.message}`);
      throw error;
    }
  }
}
