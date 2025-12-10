# Deployment Guide

## Table of Contents
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Local Development

### Quick Start
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start services with Docker
make up

# Run migrations
make migrate

# View logs
make logs
```

### Without Docker
```bash
# Start PostgreSQL and Redis locally
# Update .env with local connection strings

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
```

## Docker Deployment

### Development Environment
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Production Environment
```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Check health
curl http://localhost:3000/api/health
```

### Using Makefile
```bash
make dev      # Development with logs
make prod     # Production deployment
make scale    # Horizontal scaling (3 replicas)
make logs     # View logs
make health   # Check health
make status   # Container status
```

## Production Deployment

### Prerequisites
1. Server with Docker and Docker Compose
2. Domain name with DNS configured
3. SSL certificates (Let's Encrypt recommended)
4. Environment variables configured

### Step-by-Step

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Create app directory
mkdir -p /opt/wedo-backend
cd /opt/wedo-backend
```

#### 2. Configure Environment
```bash
# Copy files to server
scp -r . user@server:/opt/wedo-backend/

# Create production .env
cp .env.example .env
nano .env
```

Required production variables:
```env
NODE_ENV=production
DATABASE_URL=postgres://user:secure_password@postgres:5432/wedo
REDIS_URI=redis://:secure_password@redis:6379
JWT_SECRET=your-super-secure-random-string-min-32-chars
ALLOWED_ORIGINS=https://yourdomain.com
```

#### 3. SSL Setup (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot -y

# Get certificate
sudo certbot certonly --standalone -d api.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem ./ssl/
```

#### 4. Deploy
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend npm run migration:run

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### 5. Configure Firewall
```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

## Scaling

### Horizontal Scaling with Docker Swarm

#### Initialize Swarm
```bash
docker swarm init
```

#### Deploy Stack
```bash
docker stack deploy -c docker-compose.scaling.yml wedo
```

#### Scale Services
```bash
# Scale backend to 5 replicas
docker service scale wedo_backend=5

# Check status
docker service ls
docker service ps wedo_backend
```

### Load Balancing
The `docker-compose.scaling.yml` includes nginx as a load balancer:
- Round-robin distribution
- Health checks
- Automatic failover
- Rate limiting

## Monitoring

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Container health
docker ps
docker inspect backend | grep Health
```

### Logs
```bash
# View logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Specific service
docker-compose logs redis
```

### Resource Usage
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up
docker system prune -a
```

### Database Monitoring
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U user -d wedo

# Check connections
SELECT count(*) FROM pg_stat_activity;

# Database size
SELECT pg_size_pretty(pg_database_size('wedo'));
```

### Redis Monitoring
```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Info
INFO

# Memory usage
INFO memory

# Connected clients
CLIENT LIST
```

## Backup and Recovery

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U user wedo > backup_$(date +%Y%m%d).sql

# Restore
docker-compose exec -T postgres psql -U user wedo < backup_20231201.sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * cd /opt/wedo-backend && docker-compose exec postgres pg_dump -U user wedo > /backups/wedo_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check configuration
docker-compose config

# Rebuild
docker-compose build --no-cache backend
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec backend node -e "require('pg').Client({connectionString: process.env.DATABASE_URL}).connect().then(() => console.log('OK')).catch(console.error)"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Redis Connection Issues
```bash
# Check Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping

# Check password
docker-compose exec redis redis-cli -a yourpassword ping
```

### High Memory Usage
```bash
# Check container memory
docker stats

# Limit memory in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

### Port Already in Use
```bash
# Find process using port
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Or change port in .env
PORT=3001
```

## Performance Optimization

### Database
- Enable connection pooling
- Add indexes for frequently queried fields
- Use read replicas for read-heavy workloads
- Regular VACUUM and ANALYZE

### Redis
- Configure maxmemory and eviction policy
- Use Redis Cluster for high availability
- Monitor memory usage

### Application
- Enable compression
- Use caching strategically
- Optimize database queries
- Profile slow endpoints

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (min 32 chars)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Backup encryption
- [ ] Environment variables secured
- [ ] Firewall configured

## Maintenance

### Updates
```bash
# Pull latest code
git pull

# Rebuild
docker-compose build

# Restart with zero downtime
docker-compose up -d --no-deps --build backend
```

### Database Migrations
```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
docker-compose exec backend npm run migration:run

# Revert if needed
docker-compose exec backend npm run migration:revert
```

### Log Rotation
```bash
# Configure in docker-compose.yml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```
