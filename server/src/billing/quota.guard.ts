
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsageService } from './usage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(
    private usageService: UsageService,
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // Let AuthGuard handle unauthenticated
    if (user.role === 'Admin') return true; // Admins bypass quotas

    // Get Subscription
    const subscription = await this.subscriptionRepo.findOne({ where: { userId: user.userId } });
    const planId = subscription?.planId || 'Starter';

    // Check Message Quota for AI/Chat endpoints
    const path = request.path;
    if (path.includes('/ai') || path.includes('/chat')) {
        const allowed = await this.usageService.checkLimit(user.userId, planId, 'messages');
        if (!allowed) {
            throw new ForbiddenException(`Monthly message quota exceeded for ${planId} plan. Upgrade to continue.`);
        }
        
        // Optimistically increment (or do this in an interceptor after success)
        // For simplicity in guard, we assume intent to use consumes quota
        // A better approach is an Interceptor that increments on 200 OK.
        // We will leave incrementing to the service layer or interceptor to be precise.
    }

    return true;
  }
}
