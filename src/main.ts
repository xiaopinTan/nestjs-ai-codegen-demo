import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // 如果需要启用 CORS，可以取消注释这一行
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
