.PHONY: help build up down logs clean restart dev prod scale test migrate

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development
install: ## Install dependencies
	npm install

dev: ## Start development environment with logs
	docker-compose up

dev-bg: ## Start development environment in background
	docker-compose up -d

dev-debug: ## Start development with debugging
	docker-compose -f docker-compose.dev.yml up

dev-tools: ## Start development with tools (pgadmin, redis-commander, mailhog)
	docker-compose -f docker-compose.dev.yml --profile tools up -d

# Docker Operations
build: ## Build Docker images
	docker-compose build

up: ## Start services in background
	docker-compose up -d

down: ## Stop all containers
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs (follow mode)
	docker-compose logs -f

logs-backend: ## Show backend logs only
	docker-compose logs -f backend

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

# Production
prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

prod-build: ## Build production images
	docker-compose -f docker-compose.prod.yml build

prod-down: ## Stop production environment
	docker-compose -f docker-compose.prod.yml down

# Scaling
scale: ## Start with horizontal scaling (3 replicas)
	docker-compose -f docker-compose.scaling.yml up -d

scale-down: ## Stop scaling environment
	docker-compose -f docker-compose.scaling.yml down

# Database
migrate: ## Run database migrations
	npm run migration:run

migrate-generate: ## Generate new migration (name=MigrationName)
	npm run migration:generate -- -n $(name)

migrate-create: ## Create empty migration (name=MigrationName)
	npm run migration:create -- src/migrations/$(name)

migrate-revert: ## Revert last migration
	npm run migration:revert

migrate-show: ## Show migration status
	npm run migration:show

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U user -d wedo

db-backup: ## Backup database
	docker-compose exec postgres pg_dump -U user wedo > backup_$$(date +%Y%m%d_%H%M%S).sql

db-restore: ## Restore database (file=backup.sql)
	docker-compose exec -T postgres psql -U user wedo < $(file)

seed: ## Run database seeds
	npm run seed

# Testing
test: ## Run all tests
	npm test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-cov: ## Run tests with coverage
	npm run test:cov

test-e2e: ## Run end-to-end tests
	npm run test:e2e

# Code Quality
lint: ## Lint code
	npm run lint

format: ## Format code with Prettier
	npm run format

typecheck: ## Check TypeScript types
	npm run typecheck

# Utilities
shell: ## Open shell in backend container
	docker-compose exec backend sh

redis-cli: ## Open Redis CLI
	docker-compose exec redis redis-cli

health: ## Check service health
	@curl -f http://localhost:3000/api/health || echo "Backend is not healthy"

status: ## Show container status
	docker-compose ps

stats: ## Show container resource usage
	docker stats

# Monitoring
logs-errors: ## Show only error logs
	docker-compose logs | grep -i error

logs-tail: ## Show last 100 lines of logs
	docker-compose logs --tail=100

# Cleanup
prune: ## Remove unused Docker resources
	docker system prune -af --volumes

# Quick Commands
quick-start: install up migrate ## Quick start: install, up, migrate
	@echo "✅ Backend is ready at http://localhost:3000"
	@echo "📚 API docs at http://localhost:3000/api/docs"

quick-reset: down clean install up migrate ## Reset everything and start fresh
	@echo "✅ Environment reset complete"
