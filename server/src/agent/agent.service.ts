
import { Injectable, Logger } from '@nestjs/common';
import { ToolRegistryService } from './tool-registry.service';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class AgentService {
    private readonly logger = new Logger(AgentService.name);

    constructor(
        private readonly toolRegistry: ToolRegistryService,
        private readonly geminiService: GeminiService,
    ) { }

    async executeTask(prompt: string, context: any = {}) {
        const tools = this.toolRegistry.getTools();
        const model = this.geminiService.getClient().models;

        this.logger.log(`Agent received task: "${prompt}"`);

        // 1. Initial Call with Tools
        // We use gemini-2.5-flash for speed and tool capability, or pro for complex reasoning
        const modelId = 'gemini-2.5-flash';

        // Construct system instruction with context
        const systemInstruction = `You are an autonomous business operations agent. 
    You have access to real-time tools to manage inventory, operations, and more.
    Current Context: ${JSON.stringify(context)}
    
    When asked to perform a task:
    1. Check if you have a tool for it.
    2. If yes, call the tool with appropriate arguments.
    3. If the tool returns a result, use it to answer the user.
    4. If you need more info, ask the user.
    `;

        try {
            // Start a chat session to handle multi-turn function calling
            // Note: We simulate a stateless call for this endpoint, but use chat history structure
            const chat = this.geminiService.getClient().chats.create({
                model: modelId,
                config: {
                    systemInstruction,
                    tools: [{ functionDeclarations: tools }],
                }
            });

            let response = await chat.sendMessage({ message: prompt });
            let text = response.text;

            // Loop to handle function calls (Gemini SDK usually handles this if using sendMessage, 
            // but we need to execute the function server-side)

            // The server-side execution loop:
            let functionCalls = response.functionCalls;

            // Limit max turns to prevent infinite loops
            let turns = 0;
            const MAX_TURNS = 5;

            while (functionCalls && functionCalls.length > 0 && turns < MAX_TURNS) {
                turns++;
                const functionResponses = [];

                for (const call of functionCalls) {
                    try {
                        const result = await this.toolRegistry.executeTool(call.name, call.args);
                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { result: result },
                                id: call.id
                            }
                        });
                    } catch (err) {
                        functionResponses.push({
                            functionResponse: {
                                name: call.name,
                                response: { error: err.message },
                                id: call.id
                            }
                        });
                    }
                }

                // Send tool outputs back to model
                response = await chat.sendMessage({ message: functionResponses });
                text = response.text;
                functionCalls = response.functionCalls;
            }

            return {
                success: true,
                response: text,
                actionsExecuted: turns > 0
            };

        } catch (error) {
            this.logger.error('Agent execution failed', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}
