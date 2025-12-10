
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialPost } from './social-post.entity';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialPost]),
    GeminiModule
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
