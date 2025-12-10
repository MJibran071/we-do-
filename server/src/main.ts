import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Security: Helmet for HTTP headers (XSS protection, etc)
  app.use(helmet());

  // Performance: Compression
  app.use(compression());

  // Security: CORS Configuration
  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : isProduction
      ? [] // Fail-safe: no origins in production if not configured
      : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000']; // Dev defaults

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Security: Global Input Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have decorators
    transform: true, // Automatically transform payloads to DTO instances
    forbidNonWhitelisted: true, // Throw errors if non-whitelisted values are provided
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Resilience: Global Exception Filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Resilience: Graceful Shutdown
  app.enableShutdownHooks();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('We Do API')
    .setDescription('The We Do AI Backend API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // AWS requires listening on 0.0.0.0 for container networking
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`We Do Backend running on port: ${port}`);
  console.log(`Swagger Docs available at: /api/docs`);
}
bootstrap();