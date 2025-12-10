import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  expiresIn: process.env.JWT_EXPIRATION || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d',
  
  // Token options
  issuer: process.env.JWT_ISSUER || 'wedo-api',
  audience: process.env.JWT_AUDIENCE || 'wedo-app',
}));
