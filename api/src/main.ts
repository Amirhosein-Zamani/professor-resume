import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

import { AppModule } from './app.module';
import { APP_VERSION } from './config/app.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 4000);
  const webOrigin = configService.get<string>('WEB_ORIGIN');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  app.use(cookieParser());

  app.use((_request: Request, response: Response, next: NextFunction) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'same-origin');
    response.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=()',
    );

    if (isProduction) {
      response.setHeader(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains',
      );
    }

    next();
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    const safeMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
    const requestOrigin = request.get('origin');

    if (
      !safeMethods.has(request.method) &&
      requestOrigin &&
      webOrigin &&
      requestOrigin !== webOrigin
    ) {
      response.status(403).json({
        statusCode: 403,
        message: 'Request origin is not allowed.',
        error: 'Forbidden',
      });
      return;
    }

    next();
  });

  const currentDirectory = process.cwd();
  const apiRoot = existsSync(join(currentDirectory, 'prisma'))
    ? currentDirectory
    : join(currentDirectory, 'apps', 'api');

  app.useStaticAssets(join(apiRoot, 'assets'), {
    prefix: '/assets/',
  });

  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  const cookieName = configService.get<string>('COOKIE_ACCESS_NAME', 'atkn');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Professor Resume API')
    .setDescription(
      `Auth + Professor CRUD API for the professor resume site. JWT auth uses the HttpOnly cookie "${cookieName}".`,
    )
    .setVersion(APP_VERSION)
    .addCookieAuth(cookieName, {
      type: 'apiKey',
      in: 'cookie',
      name: cookieName,
      description: `JWT access cookie from COOKIE_ACCESS_NAME. Browser requests must include credentials for the cookie to be sent.`,
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);

  console.log(`API is running on http://localhost:${port}/api`);
  console.log(
    `Swagger docs are available at http://localhost:${port}/api/docs`,
  );
}

void bootstrap();
