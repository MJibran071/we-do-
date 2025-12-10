
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { RagModule } from '../rag/rag.module';
import { AiCache } from './ai-cache.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiCache]),
    RagModule
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
