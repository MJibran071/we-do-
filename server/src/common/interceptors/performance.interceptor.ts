import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - start;
          const logMessage = `${method} ${url} - ${duration}ms`;

          // Log slow requests
          if (duration > 1000) {
            this.logger.warn(`⚠️  SLOW: ${logMessage}`);
          } else if (duration > 500) {
            this.logger.log(`⚠️  ${logMessage}`);
          } else {
            this.logger.debug(logMessage);
          }

          // Add performance header
          const response = context.switchToHttp().getResponse();
          response.setHeader('X-Response-Time', `${duration}ms`);
        },
        error: (error) => {
          const duration = Date.now() - start;
          this.logger.error(
            `❌ ERROR: ${method} ${url} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}

