# Performance Optimization Guide

## Database Optimization

### Connection Pooling
```typescript
// Configured in database.config.ts
poolSize: 10,
maxQueryExecutionTime: 5000,
```

### Indexing Strategy
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### Query Optimization
- Use `select` to limit returned fields
- Implement pagination for large datasets
- Use `relations` carefully to avoid N+1 queries
- Consider using query builders for complex queries

```typescript
// Good: Select specific fields
const users = await userRepository.find({
  select: ['id', 'email', 'name'],
  take: 20,
});

// Bad: Loading all relations
const users = await userRepository.find({
  relations: ['posts', 'comments', 'likes'],
});
```

## Caching Strategy

### Redis Caching
```typescript
// Cache frequently accessed data
@Injectable()
export class CacheService {
  constructor(@Inject('REDIS') private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

### Cache Invalidation
- Invalidate cache on data updates
- Use cache tags for grouped invalidation
- Implement cache warming for critical data

## API Response Optimization

### Compression
Already enabled in `main.ts`:
```typescript
app.use(compression());
```

### Pagination
Use `PaginationDto` for all list endpoints:
```typescript
@Get()
async findAll(@Query() pagination: PaginationDto) {
  return this.service.findAll(pagination);
}
```

### Response Transformation
Use `TransformInterceptor` to standardize responses:
```typescript
app.useGlobalInterceptors(new TransformInterceptor());
```

## Load Testing

### Using Artillery
```bash
npm install -g artillery

# Create load test
cat > load-test.yml << EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
      - get:
          url: "/api/health"
EOF

# Run test
artillery run load-test.yml
```

### Using Apache Bench
```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/api/health
```

## Monitoring

### Performance Metrics
- Response time: < 200ms for simple queries
- Database query time: < 100ms
- Memory usage: < 512MB per instance
- CPU usage: < 70% under normal load

### Tools
- **New Relic**: Application performance monitoring
- **DataDog**: Infrastructure and application monitoring
- **Prometheus + Grafana**: Custom metrics and dashboards

## Optimization Checklist

- [ ] Database indexes on frequently queried fields
- [ ] Connection pooling configured
- [ ] Redis caching for hot data
- [ ] Compression enabled
- [ ] Pagination implemented
- [ ] N+1 queries eliminated
- [ ] Slow query logging enabled
- [ ] Load testing performed
- [ ] Monitoring in place
- [ ] CDN for static assets (if applicable)

## Best Practices

1. **Lazy Loading**: Load relations only when needed
2. **Batch Operations**: Use bulk inserts/updates
3. **Async Processing**: Use queues for heavy operations
4. **Rate Limiting**: Protect against abuse
5. **Connection Reuse**: Use keep-alive for HTTP clients
6. **Memory Management**: Monitor and prevent leaks
7. **Code Splitting**: Lazy load modules when possible
8. **Database Transactions**: Use for data consistency
9. **Query Result Caching**: Cache expensive queries
10. **Horizontal Scaling**: Use load balancer for multiple instances

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| API Response Time (p95) | < 200ms | < 500ms |
| Database Query Time (p95) | < 100ms | < 300ms |
| Memory Usage | < 512MB | < 1GB |
| CPU Usage | < 70% | < 90% |
| Error Rate | < 0.1% | < 1% |
| Uptime | > 99.9% | > 99% |
