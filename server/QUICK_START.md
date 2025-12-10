# Quick Start Guide

Get the backend running in 5 minutes.

## Prerequisites
- Node.js 20+
- Docker & Docker Compose

## Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` if needed (defaults work for local development).

### 3. Start Services
```bash
# Using Docker Compose
docker-compose up -d

# Or using Makefile
make up
```

This starts:
- Backend API on port 3000
- PostgreSQL on port 5432
- Redis on port 6379

### 4. Run Migrations
```bash
npm run migration:run

# Or using Makefile
make migrate
```

### 5. Verify
```bash
# Check health
curl http://localhost:3000/api/health

# View Swagger docs
open http://localhost:3000/api/docs
```

## Common Commands

```bash
# View logs
make logs

# Restart services
make restart

# Stop services
make down

# Clean everything
make clean

# Check status
make status
```

## Development Workflow

```bash
# Start with hot-reload
npm run start:dev

# In another terminal, watch logs
make logs

# Make changes to code
# Server automatically restarts
```

## Testing

```bash
# Run tests
npm test

# With coverage
npm run test:cov
```

## Database Operations

```bash
# Create migration
npm run migration:create -- -n MigrationName

# Generate migration from entities
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Access database shell
make db-shell
```

## Troubleshooting

### Port 3000 already in use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database connection error
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Redis connection error
```bash
# Restart Redis
docker-compose restart redis

# Check logs
docker-compose logs redis
```

### Clean slate
```bash
# Remove everything and start fresh
make clean
make up
make migrate
```

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review API docs at http://localhost:3000/api/docs
- Explore the codebase in `src/`

## Need Help?

- Check logs: `make logs`
- Check health: `make health`
- Check status: `make status`
- Review environment variables in `.env`
