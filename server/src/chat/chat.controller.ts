
import { Controller, Get, Param, Post, Body, Query, NotFoundException } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('threads')
  async getAllThreads() {
    const threads = await this.chatService.getAllThreads();
    return threads.sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1]?.timestamp?.getTime() || 0;
        const lastB = b.messages[b.messages.length - 1]?.timestamp?.getTime() || 0;
        return lastB - lastA;
    });
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) return [];
    return this.chatService.searchMessages(query);
  }

  @Get('thread/:id')
  async getThread(@Param('id') id: string) {
    const thread = await this.chatService.getThread(id);
    if (!thread) throw new NotFoundException(`Thread with ID ${id} not found`);
    return thread;
  }

  @Post('thread/:id/message')
  async sendMessage(@Param('id') id: string, @Body() body: { senderId: string; content: string }) {
    const message = {
      id: Date.now().toString(),
      senderId: body.senderId,
      content: body.content,
      timestamp: new Date(),
      type: 'text' as const
    };
    
    return this.chatService.saveMessage(id, message);
  }
}
