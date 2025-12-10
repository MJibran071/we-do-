import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  uri: process.env.REDIS_URI || 'redis://localhost:6379',
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  
  // Connection options
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  
  // Cache TTL (in seconds)
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
}));
