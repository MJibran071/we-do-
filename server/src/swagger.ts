import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('WeDo API')
    .setDescription('AI-powered business management platform API')
    .setVersion('1.0')
    .addTag('chat', 'Message and thread management')
    .addTag('operations', 'Bookings and maintenance')
    .addTag('crm', 'Customer relationship management')
    .addTag('ai', 'AI services and automation')
    .addTag('integrations', 'Third-party integrations')
    .addTag('webhooks', 'Webhook management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for authentication'
      },
      'api-key'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'WeDo API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  });

  // Export OpenAPI spec as JSON
  return document;
}
