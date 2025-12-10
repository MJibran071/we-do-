import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api'),
  ALLOWED_ORIGINS: Joi.string().required(),
  
  // Database
  DATABASE_URL: Joi.string().required(),
  DB_POOL_SIZE: Joi.number().default(10),
  DB_MAX_QUERY_TIME: Joi.number().default(5000),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  DB_SSL: Joi.boolean().default(false),
  
  // Redis
  REDIS_URI: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),
  REDIS_TTL: Joi.number().default(3600),
  
  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRATION: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).optional(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('30d'),
  
  // Rate limiting
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),
  
  // File upload
  MAX_FILE_SIZE: Joi.number().default(10485760),
  ALLOWED_MIME_TYPES: Joi.string().optional(),
  
  // Pagination
  DEFAULT_PAGE_LIMIT: Joi.number().default(20),
  MAX_PAGE_LIMIT: Joi.number().default(100),
  
  // Email (optional)
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().optional(),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  
  // AI APIs (optional)
  OPENAI_API_KEY: Joi.string().optional(),
  ANTHROPIC_API_KEY: Joi.string().optional(),
  GOOGLE_GEMINI_API_KEY: Joi.string().optional(),
  
  // Payment (optional)
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
  PAYPAL_CLIENT_ID: Joi.string().optional(),
  PAYPAL_CLIENT_SECRET: Joi.string().optional(),
  
  // AWS (optional)
  AWS_REGION: Joi.string().optional(),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_S3_BUCKET: Joi.string().optional(),
  
  // Monitoring (optional)
  SENTRY_DSN: Joi.string().optional(),
});
