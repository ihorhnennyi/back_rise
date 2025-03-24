import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { CandidatesModule } from './candidates/candidates.module';
import { CitiesModule } from './cities/cities.module';
import { DatabaseModule } from './database/database.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { StatusesModule } from './statuses/statuses.module';
import { UsersModule } from './users/users.module';

/**
 * 📌 Основний модуль застосунку
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ Глобальний доступ до змінних середовища
      validate: validateEnv, // 🔍 Перевірка змінних перед запуском
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/app',
    ), // ✅ Підключення до MongoDB
    DatabaseModule,
    AuthModule,
    UsersModule,
    CitiesModule,
    BranchesModule,
    StatusesModule,
    IntegrationsModule,
    CandidatesModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('🚀 Система успішно завантажена!');
  }
}

function validateEnv(env: Record<string, any>) {
  if (!env.MONGO_URI) {
    throw new Error('❌ MONGO_URI не встановлено в .env файлі!');
  }
  if (!env.JWT_SECRET) {
    throw new Error('❌ JWT_SECRET не встановлено в .env файлі!');
  }
  return env;
}
