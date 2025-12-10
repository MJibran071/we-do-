
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { AuthGuard } from '@nestjs/passport';
import { QuotaGuard } from '../billing/quota.guard';

interface ModelConfig {
    provider?: string;
    modelId?: string;
    apiKey?: string;
    endpoint?: string;
}

@Controller('ai')
@UseGuards(AuthGuard('jwt'), QuotaGuard) // Apply quota check
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('analyze')
  async analyzeMessage(@Body() body: { content: string; modelConfig?: ModelConfig }) {
    return this.geminiService.analyzeMessage(body.content, body.modelConfig);
  }

  @Post('quick-replies')
  async generateQuickReplies(@Body() body: { context: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateQuickReplies(body.context, body.modelConfig);
  }

  @Post('draft')
  async generateDraft(@Body() body: { thread: any; config: any; knowledgeBase: any; modelConfig?: ModelConfig }) {
    return this.geminiService.generateDraftReply(body.thread, body.config, body.knowledgeBase, body.modelConfig);
  }

  @Post('summarize')
  async summarizeConversation(@Body() body: { thread: any; modelConfig?: ModelConfig }) {
    return this.geminiService.summarizeConversation(body.thread, body.modelConfig);
  }

  @Post('translate')
  async translateMessage(@Body() body: { text: string; targetLanguage: string; modelConfig?: ModelConfig }) {
    return this.geminiService.translateMessage(body.text, body.targetLanguage, body.modelConfig);
  }

  @Post('extract-issues')
  async extractMaintenanceIssues(@Body() body: { thread: any; modelConfig?: ModelConfig }) {
    return this.geminiService.extractMaintenanceIssues(body.thread, body.modelConfig);
  }

  @Post('upsell')
  async detectUpsellOpportunities(@Body() body: { thread: any; appMode: string; modelConfig?: ModelConfig }) {
    return this.geminiService.detectUpsellOpportunities(body.thread, body.appMode, body.modelConfig);
  }

  @Post('transcribe')
  async transcribeAudio(@Body() body: { audio: string; mimeType: string; modelConfig?: ModelConfig }) {
    return this.geminiService.transcribeAudio(body.audio, body.mimeType, body.modelConfig);
  }

  @Post('voice-command')
  async parseVoiceCommand(@Body() body: { transcript: string; context: any }) {
    return this.geminiService.parseVoiceCommand(body.transcript, body.context);
  }

  @Post('marketing/content')
  async generateCampaignContent(@Body() body: { goal: string; audience: string; appMode: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateCampaignContent(body.goal, body.audience, body.appMode, body.modelConfig);
  }

  @Post('marketing/image')
  async generateMarketingImage(@Body() body: { prompt: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateMarketingImage(body.prompt, body.modelConfig);
  }

  @Post('marketing/video')
  async generateMarketingVideo(@Body() body: { prompt: string }) {
    return this.geminiService.generateMarketingVideo(body.prompt);
  }

  @Post('review/reply')
  async generateReviewReply(@Body() body: { review: any; tone: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateReviewReply(body.review, body.tone, body.modelConfig);
  }

  @Post('briefing')
  async generateMorningBriefing(@Body() body: { threads: any[]; modelConfig?: ModelConfig }) {
    return this.geminiService.generateMorningBriefing(body.threads, body.modelConfig);
  }
  
  @Post('diagnose')
  async diagnoseMaintenanceIssue(@Body() body: { image: string }) {
    return this.geminiService.diagnoseMaintenanceIssue(body.image);
  }

  @Post('inventory')
  async analyzeInventoryPhoto(@Body() body: { image: string; knownItems: string[] }) {
    return this.geminiService.analyzeInventoryPhoto(body.image, body.knownItems);
  }
  
  @Post('receipt')
  async parseReceiptImage(@Body() body: { image: string }) {
    return this.geminiService.parseReceiptImage(body.image);
  }

  @Post('scrape')
  async scrapeUrlForConfig(@Body() body: { url: string }) {
    return this.geminiService.scrapeUrlForConfig(body.url);
  }

  @Post('marketing/refine')
  async refineMarketingText(@Body() body: { text: string; instruction: string; modelConfig?: ModelConfig }) {
    return this.geminiService.refineMarketingText(body.text, body.instruction, body.modelConfig);
  }

  @Post('social/content')
  async generateSocialContent(@Body() body: { image: string; platform: string; tone: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateSocialContent(body.image, body.platform, body.tone, body.modelConfig);
  }

  @Post('marketing/winback')
  async generateWinBackMessage(@Body() body: { name: string; lastPurchase: string; appMode: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateWinBackMessage(body.name, body.lastPurchase, body.appMode, body.modelConfig);
  }

  @Post('marketing/referral')
  async generateReferralMessage(@Body() body: { name: string; reward: string; modelConfig?: ModelConfig }) {
    return this.geminiService.generateReferralMessage(body.name, body.reward, body.modelConfig);
  }

  @Post('review/trends')
  async analyzeReviewTrends(@Body() body: { reviews: any[]; modelConfig?: ModelConfig }) {
    return this.geminiService.analyzeReviewTrends(body.reviews, body.modelConfig);
  }

  @Post('voice/reply')
  async generateVoiceAgentReply(@Body() body: { transcript: string; voiceId: string }) {
    return this.geminiService.generateVoiceAgentReply(body.transcript, body.voiceId);
  }

  @Post('voice/translate')
  async translateAndReplyVoice(@Body() body: { transcript: string; voiceId: string }) {
    return this.geminiService.translateAndReplyVoice(body.transcript, body.voiceId);
  }
  
  @Post('analyst')
  async askBusinessAnalyst(@Body() body: { query: string; context: any; modelConfig?: ModelConfig }) {
      return this.geminiService.askBusinessAnalyst(body.query, body.context, body.modelConfig);
  }
  
  @Post('marketing/promo/gap')
  async generateGapNightPromo(@Body() body: { target: string; offer: string; appMode: string; modelConfig?: ModelConfig }) {
      return this.geminiService.generateGapNightPromo(body.target, body.offer, body.appMode, body.modelConfig);
  }
  
  @Post('marketing/promo/lead')
  async generateLeadRecoveryMessage(@Body() body: { name: string; details: string; appMode: string; modelConfig?: ModelConfig }) {
      return this.geminiService.generateLeadRecoveryMessage(body.name, body.details, body.appMode, body.modelConfig);
  }
  
  @Post('learn')
  async detectNewKnowledge(@Body() body: { text: string; kb: any }) {
      return this.geminiService.detectNewKnowledge(body.text, body.kb);
  }
  
  @Post('parse-pdf')
  async parsePDFDocument(@Body() body: { base64: string; mimeType: string }) {
      return this.geminiService.parsePDFDocument(body.base64, body.mimeType);
  }
}
