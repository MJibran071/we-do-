
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { EXPOSE_API_METADATA, ExposeApiOptions } from './expose-api.decorator';

interface RpcMethod {
  serviceName: string;
  methodName: string;
  instance: any;
  options: ExposeApiOptions;
}

@Injectable()
export class RpcDiscoveryService implements OnModuleInit {
  private readonly logger = new Logger(RpcDiscoveryService.name);
  private rpcMethods = new Map<string, RpcMethod>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.discoverMethods();
  }

  private discoverMethods() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance !== 'object') return;

      const prototype = Object.getPrototypeOf(instance);
      if (!prototype) return;

      const serviceName = instance.constructor.name.replace('Service', '').toLowerCase();

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (methodName) => {
          const method = instance[methodName];
          const metadata = this.reflector.get<ExposeApiOptions>(
            EXPOSE_API_METADATA,
            method,
          );

          if (metadata) {
            const key = `${serviceName}.${metadata.path || methodName}`.toLowerCase();
            
            this.rpcMethods.set(key, {
              serviceName,
              methodName,
              instance,
              options: metadata,
            });

            this.logger.log(`RPC Registered: ${key} -> ${instance.constructor.name}.${methodName}`);
          }
        },
      );
    });
  }

  getMethod(service: string, method: string): RpcMethod | undefined {
    return this.rpcMethods.get(`${service}.${method}`.toLowerCase());
  }

  getAllMethods() {
      return Array.from(this.rpcMethods.entries()).map(([key, val]) => ({
          key,
          description: val.options.description,
          method: val.options.method || 'POST'
      }));
  }
}
