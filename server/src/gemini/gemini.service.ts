
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { RagService } from '../rag/rag.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiCache } from './ai-cache.entity';

interface ModelConfig {
    provider?: string;
    modelId?: string;
    apiKey?: string;
    endpoint?: string;
}

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(GeminiService.name);

  constructor(
    private readonly ragService: RagService,
    @InjectRepository(AiCache)
    private aiCacheRepo: Repository<AiCache>
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  getClient(): GoogleGenAI {
      return this.ai;
  }

  // --- Unified Dispatcher with Semantic Caching ---
  private async generateText(
      prompt: string, 
      config: ModelConfig = {}, 
      jsonSchema?: any
  ): Promise<string> {
      // 1. Check Cache
      const cached = await this.checkCache(prompt);
      if (cached) {
          this.logger.log('Cache hit for prompt');
          return cached;
      }

      const provider = config.provider || 'Google Gemini';
      const modelId = config.modelId || 'gemini-2.5-flash';
      const apiKey = config.apiKey || process.env.API_KEY;

      let responseText = '';

      if (provider === 'Google Gemini') {
          responseText = await this.callGoogle(prompt, modelId, apiKey, jsonSchema);
      } else {
          responseText = await this.callOpenAICompatible(prompt, config, jsonSchema);
      }

      // 2. Save to Cache (asynchronously)
      this.saveToCache(prompt, responseText).catch(err => 
          this.logger.error('Failed to cache response', err)
      );

      return responseText;
  }

  private async checkCache(prompt: string): Promise<string | null> {
      try {
          const embedding = await this.ragService.generateEmbedding(prompt);
          if (embedding.length === 0) return null;

          const embeddingString = `[${embedding.join(',')}]`;
          const threshold = 0.1; // Very strictly similar

          const result = await this.aiCacheRepo
            .createQueryBuilder('cache')
            .select(['cache.response'])
            .where('cache.embedding <-> :embedding < :threshold', { embedding: embeddingString, threshold })
            .orderBy('cache.embedding <-> :embedding', 'ASC')
            .getOne();

          return result ? result.response : null;
      } catch (e) {
          this.logger.warn(`Cache check failed: ${e.message}`);
          return null;
      }
  }

  private async saveToCache(prompt: string, response: string) {
      if (!response || response.length < 5) return;
      try {
          const embedding = await this.ragService.generateEmbedding(prompt);
          if (embedding.length > 0) {
              const cacheEntry = this.aiCacheRepo.create({
                  prompt,
                  response,
                  embedding
              });
              await this.aiCacheRepo.save(cacheEntry);
          }
      } catch (e) {
          this.logger.error(`Failed to save cache: ${e.message}`);
      }
  }

  private async callGoogle(prompt: string, modelId: string, apiKey?: string, jsonSchema?: any): Promise<string> {
      // Use provided API key or fall back to instance client
      const client = apiKey ? new GoogleGenAI({ apiKey }) : this.ai;
      
      const options: any = {
          model: modelId,
          contents: prompt,
      };
      
      if (jsonSchema) {
          options.config = {
              responseMimeType: "application/json",
              responseSchema: jsonSchema
          };
      }

      const response = await client.models.generateContent(options);
      return response.text || '';
  }

  private async callOpenAICompatible(prompt: string, config: ModelConfig, jsonSchema?: any): Promise<string> {
      const { provider, modelId, apiKey, endpoint } = config;
      
      if (!apiKey && !endpoint) {
          throw new Error(`API key or endpoint required for provider: ${provider}`);
      }

      const model = modelId || 'gpt-4o';
      const baseUrl = endpoint || this.getProviderBaseUrl(provider);
      
      try {
          switch (provider) {
              case 'OpenAI':
                  return await this.callOpenAI(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'Anthropic':
                  return await this.callAnthropic(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'DeepSeek':
                  return await this.callDeepSeek(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'xAI':
                  return await this.callGrok(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'Meta':
                  return await this.callMeta(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'Mistral':
                  return await this.callMistral(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'OpenRouter':
                  return await this.callOpenRouter(prompt, model, apiKey!, jsonSchema, baseUrl);
              case 'Custom':
                  return await this.callCustomEndpoint(prompt, model, apiKey, endpoint!, jsonSchema);
              default:
                  throw new Error(`Unsupported provider: ${provider}`);
          }
      } catch (error) {
          this.logger.error(`Error calling ${provider}: ${error.message}`);
          throw error;
      }
  }

  private getProviderBaseUrl(provider: string): string {
      const urls: Record<string, string> = {
          'OpenAI': 'https://api.openai.com/v1',
          'Anthropic': 'https://api.anthropic.com/v1',
          'DeepSeek': 'https://api.deepseek.com/v1',
          'xAI': 'https://api.x.ai/v1',
          'Meta': 'https://api.meta.ai/v1',
          'Mistral': 'https://api.mistral.ai/v1',
          'OpenRouter': 'https://openrouter.ai/api/v1'
      };
      return urls[provider] || 'https://api.openai.com/v1';
  }

  private async callOpenAI(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const messages = [{ role: 'user', content: prompt }];
      const body: any = {
          model,
          messages,
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
          // OpenAI requires JSON mode prompt instruction
          messages[0].content = `${prompt}\n\nRespond in valid JSON format matching this schema: ${JSON.stringify(jsonSchema)}`;
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`OpenAI API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callAnthropic(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const body: any = {
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/messages`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`Anthropic API error: ${error}`);
      }

      const data = await response.json();
      return data.content[0]?.text || '';
  }

  private async callDeepSeek(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const body: any = {
          model: model || 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`DeepSeek API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callGrok(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const body: any = {
          model: model || 'grok-beta',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`xAI/Grok API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callMeta(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      // Meta Llama typically uses OpenAI-compatible API
      const body: any = {
          model: model || 'llama-3-70b-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`Meta API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callMistral(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const body: any = {
          model: model || 'mistral-large-latest',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`Mistral API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callOpenRouter(prompt: string, model: string, apiKey: string, jsonSchema: any, baseUrl: string): Promise<string> {
      const body: any = {
          model: model || 'openai/gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': 'https://wedo.ai',
              'X-Title': 'We Do AI'
          },
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`OpenRouter API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
  }

  private async callCustomEndpoint(prompt: string, model: string, apiKey: string | undefined, endpoint: string, jsonSchema: any): Promise<string> {
      // Try OpenAI-compatible format first
      const body: any = {
          model: model || 'custom-model',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7
      };

      if (jsonSchema) {
          body.response_format = { type: 'json_object' };
      }

      const headers: Record<string, string> = {
          'Content-Type': 'application/json'
      };

      if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          const error = await response.text();
          throw new Error(`Custom endpoint error: ${error}`);
      }

      const data = await response.json();
      // Support both OpenAI and custom response formats
      return data.choices?.[0]?.message?.content || data.content || data.text || JSON.stringify(data);
  }

  // --- Refactored Methods using strict JSON Schema ---

  async analyzeMessage(content: string, modelConfig?: ModelConfig) {
    const prompt = `Analyze this message: "${content}".`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative', 'Angry'] },
            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            summary: { type: Type.STRING }
        },
        required: ['sentiment', 'priority', 'summary']
    };

    try {
        const text = await this.generateText(prompt, modelConfig, schema);
        return JSON.parse(text);
    } catch {
        return { sentiment: 'Neutral', priority: 'Medium', summary: 'Error analyzing message' }; 
    }
  }

  async extractMaintenanceIssues(thread: any, modelConfig?: ModelConfig) {
      const threadContent = thread.messages.map((m: any) => `${m.senderId}: ${m.content}`).join('\n');
      const prompt = `Identify maintenance issues from this thread. Return a list.
      Conversation:
      ${threadContent}`;

      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  issue: { type: Type.STRING },
                  location: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
              },
              required: ['issue', 'location', 'priority']
          }
      };

      try {
          const text = await this.generateText(prompt, modelConfig, schema);
          return JSON.parse(text);
      } catch {
          return [];
      }
  }

  async categorizeTransaction(description: string, amount: number) {
      const prompt = `Categorize this bank transaction: "${description}" ($${amount}).`;
      
      const schema = {
          type: Type.OBJECT,
          properties: {
              category: { type: Type.STRING },
              vendor: { type: Type.STRING }
          },
          required: ['category', 'vendor']
      };

      try {
          const text = await this.generateText(prompt, undefined, schema);
          return JSON.parse(text);
      } catch {
          return { category: 'Uncategorized', vendor: 'Unknown' };
      }
  }

  // --- Other Methods (Standard Text Generation) ---

  async generateQuickReplies(context: string, modelConfig?: ModelConfig): Promise<string[]> {
      const prompt = `Suggest 3 short, professional quick replies for this context: "${context}". Return JSON array of strings.`;
      const schema = {
          type: Type.ARRAY,
          items: { type: Type.STRING }
      };
      try {
          const text = await this.generateText(prompt, modelConfig, schema);
          return JSON.parse(text);
      } catch {
          return ["Received.", "Will check.", "Thank you."];
      }
  }

  async generateDraftReply(thread: any, config: any, kb: any, modelConfig?: ModelConfig) {
      // Use RAG context if available
      const lastMessage = thread.messages[thread.messages.length - 1].content;
      const context = await this.ragService.retrieveContext(lastMessage);
      
      const prompt = `Draft a reply.
      Tone: ${config.tone}
      Context from Knowledge Base: ${context}
      User Message: "${lastMessage}"
      
      Just return the reply text.`;
      
      return this.generateText(prompt, modelConfig);
  }

  async summarizeConversation(thread: any, modelConfig?: ModelConfig) {
      const content = thread.messages.map((m: any) => `${m.senderId}: ${m.content}`).join('\n');
      return this.generateText(`Summarize this conversation in 2 sentences:\n${content}`, modelConfig);
  }

  async translateMessage(text: string, lang: string, modelConfig?: ModelConfig) {
      return this.generateText(`Translate to ${lang}: "${text}"`, modelConfig);
  }

  async detectUpsellOpportunities(thread: any, appMode: string, modelConfig?: ModelConfig) {
      const prompt = `Analyze this conversation for upsell opportunities (${appMode}). Return JSON array.`;
      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  suggestedReply: { type: Type.STRING },
                  potentialRevenue: { type: Type.NUMBER }
              }
          }
      };
      try {
          const text = await this.generateText(prompt, modelConfig, schema);
          return JSON.parse(text);
      } catch { return []; }
  }

  async transcribeAudio(audio: string, mime: string, config?: ModelConfig) {
      try {
          const response = await this.ai.models.generateContent({
              model: 'gemini-1.5-flash',
              contents: {
                  parts: [
                      { inlineData: { data: audio, mimeType: mime } },
                      { text: "Transcribe this audio and detect sentiment." }
                  ]
              },
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          text: { type: Type.STRING },
                          sentiment: { type: Type.STRING }
                      }
                  }
              }
          });
          return JSON.parse(response.text || '{}');
      } catch {
          return { text: "Audio processing failed", sentiment: "Neutral" };
      }
  }

  async parseVoiceCommand(transcript: string, ctx: any) {
      const prompt = `Parse voice command: "${transcript}". Context: ${JSON.stringify(ctx)}.
      Return JSON: type (NAVIGATE, DRAFT_MESSAGE, BLOCK_CALENDAR, CREATE_TICKET, UNKNOWN), data (object).`;
      
      const schema = {
          type: Type.OBJECT,
          properties: {
              type: { type: Type.STRING, enum: ['NAVIGATE', 'DRAFT_MESSAGE', 'BLOCK_CALENDAR', 'CREATE_TICKET', 'UNKNOWN'] },
              data: { type: Type.OBJECT, properties: {}, nullable: true },
              originalTranscript: { type: Type.STRING }
          }
      };
      
      try {
          const text = await this.generateText(prompt, undefined, schema);
          return JSON.parse(text);
      } catch { return { type: 'UNKNOWN', originalTranscript: transcript }; }
  }

  // --- Marketing & Other Methods ---
  async generateCampaignContent(goal: string, aud: string, mode: string, config?: ModelConfig) { 
      const prompt = `Write marketing content. Goal: ${goal}. Audience: ${aud}. Mode: ${mode}. Return JSON: subject, body.`;
      const schema = {
          type: Type.OBJECT,
          properties: { subject: { type: Type.STRING }, body: { type: Type.STRING } }
      };
      try { return JSON.parse(await this.generateText(prompt, config, schema)); } catch { return { subject: '', body: '' }; }
  }
  
  async generateMarketingImage(prompt: string, modelConfig?: ModelConfig) { 
      return "https://via.placeholder.com/1024"; 
  }
  
  async generateMarketingVideo(prompt: string) { return ""; }
  async generateReviewReply(rev: any, tone: string, config?: ModelConfig) { return this.generateText(`Reply to review (${tone}): "${rev.content}"`, config); }
  async generateMorningBriefing(threads: any[], config?: ModelConfig) { 
      const prompt = `Generate morning briefing items from these threads. Return JSON array.`;
      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  priority: { type: Type.STRING },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
              }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, config, schema)); } catch { return []; }
  }

  async diagnoseMaintenanceIssue(img: string) { return { diagnosis: "Analysis unavailable", parts: [] }; }
  async analyzeInventoryPhoto(img: string, items: string[]) { return { items: [] }; }
  async analyzeCustomerSegments(cust: any, hist: string) { 
      const prompt = `Analyze customer segment. History: ${hist}. Return JSON.`;
      const schema = {
          type: Type.OBJECT,
          properties: {
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              segment: { type: Type.STRING },
              summary: { type: Type.STRING }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, undefined, schema)); } catch { return { tags: [], segment: "Unknown", summary: "" }; }
  }
  async parseReceiptImage(img: string) { return { category: 'Other', vendor: 'Unknown', amount: 0, date: new Date().toISOString() }; }
  async synthesizeSpeech(text: string) { return ""; }
  async scrapeUrlForConfig(url: string) { return { name: "Business", description: "", tone: "Friendly", businessType: "property" as any }; }
  async refineMarketingText(txt: string, instr: string, config?: ModelConfig) { return this.generateText(`Refine: "${txt}". Instruction: ${instr}`, config); }
  async generateSocialContent(img: string, plat: string, tone: string, config?: ModelConfig) { 
      const prompt = `Generate social caption for platform ${plat}, tone ${tone}. Return JSON: caption, hashtags.`;
      const schema = {
          type: Type.OBJECT,
          properties: { caption: { type: Type.STRING }, hashtags: { type: Type.ARRAY, items: { type: Type.STRING } } }
      };
      try { return JSON.parse(await this.generateText(prompt, config, schema)); } catch { return { caption: "", hashtags: [] }; }
  }
  async generateWinBackMessage(name: string, pur: string, mode: string, config?: ModelConfig) { 
      const prompt = `Write winback message for ${name} who bought ${pur}. Mode: ${mode}. Return JSON: thoughtProcess, message.`;
      try { return JSON.parse(await this.generateText(prompt, config)); } catch { return { thoughtProcess: "", message: "" }; }
  }
  async generateReferralMessage(name: string, rew: string, config?: ModelConfig) { return { code: "REF123", message: `Join me and get ${rew}` }; }
  async analyzeReviewTrends(revs: any[], config?: ModelConfig) { return { themes: [], summary: "" }; }
  async generateVoiceAgentReply(trans: string, id: string) { return this.generateText(`Reply to: "${trans}" as voice ${id}.`); }
  async translateAndReplyVoice(trans: string, id: string) { return { translation: trans, reply: "Ok", language: "en" }; }
  
  async askBusinessAnalyst(q: string, ctx: any, config?: ModelConfig) { 
      const prompt = `Business Analyst Question: "${q}". Context: ${JSON.stringify(ctx)}. 
      If the user asks for a visualization, trend, or comparison, generate a 'chart' object.
      Return JSON: answer, metric, value, chart (optional: { type: 'bar'|'line'|'pie', title: string, data: [{name: string, value: number}], xKey: string, dataKey: string }).`;
      
      const schema = {
          type: Type.OBJECT,
          properties: { 
              answer: { type: Type.STRING }, 
              metric: { type: Type.STRING, nullable: true }, 
              value: { type: Type.STRING, nullable: true },
              chart: {
                  type: Type.OBJECT,
                  nullable: true,
                  properties: {
                      type: { type: Type.STRING, enum: ['bar', 'line', 'pie'] },
                      title: { type: Type.STRING },
                      data: { 
                          type: Type.ARRAY, 
                          items: { 
                              type: Type.OBJECT,
                              properties: {
                                  name: { type: Type.STRING },
                                  value: { type: Type.NUMBER }
                              }
                          } 
                      },
                      xKey: { type: Type.STRING },
                      dataKey: { type: Type.STRING }
                  }
              }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, config, schema)); } catch { return { answer: "I couldn't analyze that." }; }
  }

  async generateGapNightPromo(tgt: string, off: string, mode: string, config?: ModelConfig) { return this.generateText(`Write promo for ${tgt} offering ${off} in ${mode}.`); }
  async generateLeadRecoveryMessage(nm: string, det: string, mode: string, config?: ModelConfig) { return this.generateText(`Write lead recovery for ${nm} about ${det} in ${mode}.`); }
  async detectNewKnowledge(txt: string, kb: any) { return null; }
  async parsePDFDocument(b64: string, mime: string) { return []; }

  async generateStaffSchedule(bookings: any[], start: Date, end: Date) {
      const prompt = `Generate shift schedule. Return JSON array.`;
      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: { role: { type: Type.STRING }, start: { type: Type.STRING }, end: { type: Type.STRING } }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, undefined, schema)); } catch { return []; }
  }

  async analyzePricingStrategy(location: string, dates: string[], occupancy: number) {
      const prompt = `Analyze pricing. Return JSON array of daily recommendations.`;
      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  date: { type: Type.STRING },
                  demandLevel: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  suggestedPrice: { type: Type.NUMBER },
                  event: { type: Type.STRING }
              }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, undefined, schema)); } catch { return []; }
  }

  async generateSocialCampaign(theme: string, businessType: string, count: number) {
      const prompt = `Generate ${count} social posts for ${businessType} about ${theme}. Return JSON array.`;
      const schema = {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: { caption: { type: Type.STRING }, visualDescription: { type: Type.STRING } }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, undefined, schema)); } catch { return []; }
  }

  async analyzeFinancialAnomalies(transactions: any[]) {
      const prompt = `Analyze financial anomalies. Return JSON array of flags.`;
      const schema = {
          type: Type.OBJECT,
          properties: {
              flags: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          transactionId: { type: Type.STRING },
                          reason: { type: Type.STRING },
                          severity: { type: Type.STRING }
                      }
                  }
              }
          }
      };
      try { return JSON.parse(await this.generateText(prompt, undefined, schema)); } catch { return { flags: [] }; }
  }

  async forecastCashFlow(history: any[]) { return { forecast: [], confidence: 'Medium' }; }
  
  async analyzeCompetitorPage(url: string) {
      const prompt = `Analyze competitor URL: "${url}". Extract: name, businessType, strengths, weaknesses, sentimentScore (0-1), and currentPrices (productName, price).`;
      const schema = {
          type: Type.OBJECT,
          properties: {
              name: { type: Type.STRING },
              businessType: { type: Type.STRING },
              strengths: { type: Type.STRING },
              weaknesses: { type: Type.STRING },
              sentimentScore: { type: Type.NUMBER },
              currentPrices: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          productName: { type: Type.STRING },
                          price: { type: Type.NUMBER }
                      }
                  }
              }
          }
      };
      try { 
          const text = await this.generateText(prompt, undefined, schema);
          return JSON.parse(text); 
      } catch { 
          return { 
              name: "Competitor", 
              businessType: "Unknown",
              strengths: "",
              weaknesses: "",
              sentimentScore: 0.5,
              currentPrices: []
          }; 
      }
  }
}
