import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Health check 端點（不需要前綴）
  app.use(async (req, res, next) => {
    if (req.url === '/' || req.url === '/health') {
      const { HealthController } = await import('./modules/health/health.controller');
      const controller = new HealthController(
        app.get('PrismaService')
      );
      return controller.check().then(data => res.json(data));
    }
    next();
  });

  // API 全局前綴
  app.setGlobalPrefix('api/v1');

  // 驗證管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger API 文檔
  const config = new DocumentBuilder()
    .setTitle('PetGroom HK API')
    .setDescription('香港寵物美容平台 API 文檔')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '認證相關')
    .addTag('users', '用戶相關')
    .addTag('shops', '店家相關')
    .addTag('services', '服務相關')
    .addTag('reviews', '評論相關')
    .addTag('favorites', '收藏相關')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 啟動伺服器
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 PetGroom HK API 已啟動！`);
  console.log(`📚 API 文檔: http://localhost:${port}/api/docs`);
  console.log(`🌐 API 端點: http://localhost:${port}/api/v1`);
}

bootstrap();
