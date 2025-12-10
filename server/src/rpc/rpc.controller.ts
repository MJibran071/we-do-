
import { Controller, All, Param, Body, Query, Req, NotFoundException, ForbiddenException, Get } from '@nestjs/common';
import { RpcDiscoveryService } from './rpc-discovery.service';
import { Request } from 'express';

@Controller('rpc')
export class RpcController {
  constructor(private readonly discoveryService: RpcDiscoveryService) {}

  @Get('directory')
  getDirectory() {
      return this.discoveryService.getAllMethods();
  }

  @All(':service/:method')
  async handleRpc(
    @Param('service') service: string,
    @Param('method') method: string,
    @Body() body: any,
    @Query() query: any,
    @Req() req: any
  ) {
    const rpcMethod = this.discoveryService.getMethod(service, method);

    if (!rpcMethod) {
      throw new NotFoundException(`RPC method ${service}.${method} not found`);
    }

    // RBAC Check (Simple version, assumes user is attached to req via Guard if token present)
    if (rpcMethod.options.roles && rpcMethod.options.roles.length > 0) {
        // Since this is a public controller we might need to manually check auth if not globally guarded
        // For now, we assume global guard or no guard. If auth is present:
        const userRole = req.user?.role;
        if (!userRole || (userRole !== 'Admin' && !rpcMethod.options.roles.includes(userRole))) {
             throw new ForbiddenException('Insufficient permissions for this RPC method');
        }
    }

    // Merge body and query for convenience, or strictly use body for POST
    const args = { ...query, ...body };
    
    // Execute
    // Note: If the service method expects individual arguments instead of an object, 
    // we would need more complex reflection or a convention.
    // Convention: RPC exposed methods should accept a single DTO object or no args.
    return rpcMethod.instance[rpcMethod.methodName](args);
  }
}
