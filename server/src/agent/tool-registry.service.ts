
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { AI_TOOL_METADATA, AiToolOptions } from './ai-tool.decorator';
import { FunctionDeclaration, Type } from '@google/genai';

@Injectable()
export class ToolRegistryService implements OnModuleInit {
  private readonly logger = new Logger(ToolRegistryService.name);
  private tools = new Map<string, { instance: any; methodName: string; declaration: FunctionDeclaration }>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.discoverTools();
  }

  private discoverTools() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((wrapper) => {
      const { instance } = wrapper;
      if (!instance || typeof instance !== 'object') return;

      const prototype = Object.getPrototypeOf(instance);
      if (!prototype) return;

      this.metadataScanner.scanFromPrototype(
        instance,
        prototype,
        (methodName) => {
          const method = instance[methodName];
          const metadata = this.reflector.get<AiToolOptions>(
            AI_TOOL_METADATA,
            method,
          );

          if (metadata) {
            const toolName = metadata.name || methodName;
            
            // Map simple schema to Gemini Type enums if strings provided
            const parameters = this.mapParameters(metadata.parameters);

            const declaration: FunctionDeclaration = {
              name: toolName,
              description: metadata.description,
              parameters: parameters,
            };

            this.tools.set(toolName, {
              instance,
              methodName,
              declaration,
            });

            this.logger.log(`Registered AI Tool: ${toolName} -> ${instance.constructor.name}.${methodName}`);
          }
        },
      );
    });
  }

  private mapParameters(params: any): any {
      if (!params) return undefined;
      // Deep clone or simple pass through if manually typed correctly
      // Ensure 'type' fields are uppercase strings matching Gemini Type enum keys if needed
      return params; 
  }

  getTools(): FunctionDeclaration[] {
    return Array.from(this.tools.values()).map((t) => t.declaration);
  }

  async executeTool(name: string, args: any) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    this.logger.log(`Executing tool ${name} with args: ${JSON.stringify(args)}`);
    return tool.instance[tool.methodName](args);
  }
}
