
import { SetMetadata } from '@nestjs/common';

export const EXPOSE_API_METADATA = 'EXPOSE_API_METADATA';

export interface ExposeApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; // Default POST
  path?: string; // Default to method name
  roles?: string[]; // RBAC
  description?: string;
}

/**
 * Automatically exposes a service method as an API endpoint via the RPC Controller.
 * Default route: /api/rpc/{ServiceName}/{MethodName}
 */
export const ExposeApi = (options: ExposeApiOptions = {}) => SetMetadata(EXPOSE_API_METADATA, options);
