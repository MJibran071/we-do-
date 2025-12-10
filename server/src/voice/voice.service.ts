
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CallSession } from './call-session.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class VoiceService {
  constructor(
    @InjectRepository(CallSession)
    private callRepo: Repository<CallSession>,
    private readonly geminiService: GeminiService
  ) {}

  async createSession(callerNumber: string, direction: 'inbound' | 'outbound', externalId?: string) {
    const call = this.callRepo.create({
        callerNumber,
        direction,
        externalId,
        status: 'active'
    });
    return this.callRepo.save(call);
  }

  async endSession(id: string, transcript?: string, recordingUrl?: string) {
    const call = await this.callRepo.findOne({ where: { id } });
    if (!call) return;

    call.status = 'completed';
    call.endTime = new Date();
    if (transcript) call.transcript = transcript;
    if (recordingUrl) call.recordingUrl = recordingUrl;

    // AI Summary
    if (transcript) {
        const analysis = await this.geminiService.analyzeMessage(transcript);
        call.summary = analysis.summary;
    }

    return this.callRepo.save(call);
  }

  async getSessions() {
      return this.callRepo.find({ order: { startTime: 'DESC' } });
  }
}
