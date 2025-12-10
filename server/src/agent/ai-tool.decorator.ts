
import { SetMetadata } from '@nestjs/common';

export const AI_TOOL_METADATA = 'AI_TOOL_METADATA';

export interface AiToolOptions {
  name?: string;
  description: string;
  parameters?: {
    type: string; // 'OBJECT'
    properties: Record<string, any>;
    required?: string[];
  };
}

export const AiTool = (options: AiToolOptions) => SetMetadata(AI_TOOL_METADATA, options);
