
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { DeveloperService } from '../developer/developer.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private developerService: DeveloperService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'];

    if (!key) {
      throw new UnauthorizedException('API Key missing');
    }

    const validKey = await this.developerService.validateKey(key);
    if (!validKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // Attach user context for logging
    req.user = { userId: validKey.userId, role: 'API_CLIENT' };
    
    return true;
  }
}
