import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const uploadDir = join(process.cwd(), 'uploads');
  mkdirSync(join(uploadDir, 'photos'), { recursive: true });
  mkdirSync(join(uploadDir, 'pages'), { recursive: true });

  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (process.env.FRONTEND_URL || 'http://localhost:4200').split(','),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Ertaklar API http://localhost:${port}/api`);
}
bootstrap();
