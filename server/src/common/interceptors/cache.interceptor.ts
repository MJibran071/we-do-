import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../cache/cache.service';
import { CACHE_TTL_KEY } from '../decorators/cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const cacheConfig = this.reflector.get<{
      ttl: number;
      keyGenerator?: (...args: any[]) => string;
    }>(CACHE_TTL_KEY, handler);

    if (!cacheConfig) {
      return next.handle();
    }

    // Generate cache key
    const cacheKey = cacheConfig.keyGenerator
      ? cacheConfig.keyGenerator(request.params, request.query, request.body)
      : `cache:${request.method}:${request.url}`;

    // Try to get from cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached !== null) {
      return of(cached);
    }

    // If not cached, execute handler and cache result
    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheService.set(cacheKey, data, cacheConfig.ttl);
      }),
    );
  }
}

