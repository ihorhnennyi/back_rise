import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://workriseup.website'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: 'GET, POST, PATCH, DELETE',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('CRM API')
    .setDescription('📜 Документація API для CRM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

  await app.listen(PORT, '0.0.0.0');
  console.log(`Сервер запущен на: http://localhost:${PORT}`);
  console.log(`Swagger API Docs: http://localhost:${PORT}/api/docs`);
}

function validateEnv() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Помилка: змінна JWT_SECRET не встановлена у .env файлі!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Помилка: змінна MONGO_URI не встановлена у .env файлі!');
  }
  if (process.env.PORT && isNaN(Number(process.env.PORT))) {
    throw new Error('Помилка: PORT має бути числом!');
  }
}

bootstrap();
