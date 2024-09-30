import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  // Enable CORS for cross-origin resource sharing
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
