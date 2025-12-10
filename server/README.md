# We Do Backend - NestJS API

Enterprise-grade NestJS backend with TypeORM, Redis, PostgreSQL with pgvector, and comprehensive integrations.

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 14+ (with pgvector extension)
- Redis 7+

### Development Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Run migrations**
```bash
npm run migration:run
```

5. **Start development server**
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`
Swagger docs at `http://localhost:3000/api/docs`

## Docker Configuration

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Build standalone image
```bash
docker build -t wedo-backend .
docker run -p 3000:3000 --env-file .env wedo-backend
```

## TypeScript Configuration

The project uses strict TypeScript settings for better type safety:
- `strict: true` - All strict type-checking options enabled
- `noImplicitAny: true` - Error on expressions with implied 'any' type
- `strictNullChecks: true` - Strict null checking
- `noUnusedLocals: true` - Report errors on unused locals
- `noUnusedParameters: true` - Report errors on unused parameters

## Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run build              # Build for production
npm run start:prod         # Start production build

# Database Migrations
npm run migration:generate # Generate migration from entities
npm run migration:create   # Create empty migration
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Lint and fix code
```

## Architecture

### Core Modules
- **Auth** - JWT authentication with Passport
- **Users** - User management
- **Healthcare** - Patient records and medical data
- **Airbnb** - Property management integration
- **AI** - AI/ML integrations (OpenAI, Anthropic, Gemini)
- **Webhooks** - Webhook management
- **Notifications** - Multi-channel notifications
- **Storage** - File upload and management
- **Queue** - BullMQ job processing
- **Analytics** - Usage tracking and reporting

### Infrastructure
- **Database**: PostgreSQL with pgvector for embeddings
- **Cache**: Redis for sessions and caching
- **Queue**: BullMQ for background jobs
- **WebSockets**: Socket.io for real-time features
- **API Docs**: Swagger/OpenAPI

## Environment Variables

See `.env.example` for all available configuration options.

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URI` - Redis connection string
- `JWT_SECRET` - Secret for JWT signing

### Optional
- `ALLOWED_ORIGINS` - CORS allowed origins
- `SMTP_*` - Email configuration
- `*_API_KEY` - Third-party API keys
- `AWS_*` - AWS configuration

## Health Checks

- **HTTP**: `GET /api/health`
- **Docker**: Built-in healthcheck in Dockerfile

## Security Features

- Helmet.js for HTTP headers
- CORS configuration
- Rate limiting with Redis
- Input validation with class-validator
- JWT authentication
- Password hashing with bcrypt

## Performance

- Compression middleware
- Connection pooling
- Redis caching
- Incremental TypeScript builds
- Docker multi-stage builds

## Monitoring

The application includes:
- Winston logging
- Health check endpoints
- Graceful shutdown handling
- Exception filters

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Use `docker-compose.prod.yml` for deployment
4. Set up SSL/TLS termination (nginx/load balancer)
5. Configure monitoring and logging
6. Set up database backups

## Troubleshooting

### Port already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection issues
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify network connectivity

### Redis connection issues
- Check REDIS_URI format
- Ensure Redis is running
- Verify authentication if required

## License

Proprietary
