import { SetMetadata } from '@nestjs/common';

export const CACHE_TTL_KEY = 'cache_ttl';
export const CACHE_KEY_KEY = 'cache_key';

/**
 * Decorator to cache method results
 * @param ttl Time to live in seconds (default: 3600)
 * @param keyGenerator Function to generate cache key from arguments
 */
export const Cacheable = (
  ttl: number = 3600,
  keyGenerator?: (...args: any[]) => string,
) => {
  return SetMetadata(CACHE_TTL_KEY, { ttl, keyGenerator });
};

/**
 * Decorator to invalidate cache on method call
 * @param pattern Cache key pattern to invalidate
 */
export const CacheInvalidate = (pattern: string) => {
  return SetMetadata(CACHE_KEY_KEY, pattern);
};

