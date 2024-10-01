import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as csurf from 'csurf';
import { CustomLogger } from './helpers/logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(RootModule, {
    logger: console,
  });

  // logger
  // app.useLogger(Logger);

  // helmet used for headers security
  app.use(helmet());

  // Csurf configuration
  // app.use(csurf());

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
