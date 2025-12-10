
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailAccount } from './email-account.entity';
import { ChatService } from '../chat/chat.service';
import * as imaps from 'imap-simple';
import * as nodemailer from 'nodemailer';
import { simpleParser } from 'mailparser';

@Injectable()
export class EmailSyncService {
  private readonly logger = new Logger(EmailSyncService.name);

  constructor(
    @InjectRepository(EmailAccount)
    private accountRepo: Repository<EmailAccount>,
    private readonly chatService: ChatService
  ) {}

  async addAccount(config: Partial<EmailAccount>) {
    const account = this.accountRepo.create(config);
    return this.accountRepo.save(account);
  }

  async getAccounts() {
    return this.accountRepo.find();
  }

  // Called by Scheduler
  async pollAllAccounts() {
    const accounts = await this.accountRepo.find({ where: { isActive: true } });
    for (const account of accounts) {
        await this.syncImap(account);
    }
  }

  private async syncImap(account: EmailAccount) {
    const config = {
        imap: {
            user: account.username,
            password: account.password,
            host: account.imapHost,
            port: account.imapPort,
            tls: account.secure,
            authTimeout: 3000
        }
    };

    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT', ''], markSeen: true };
        
        const messages = await connection.search(searchCriteria, fetchOptions);

        for (const item of messages) {
            const all = item.parts.find(part => part.which === '');
            const id = item.attributes.uid;
            const idHeader = "Imap-Id: "+id;
            
            const mail = await simpleParser(idHeader + all.body);
            
            const fromEmail = mail.from?.value[0]?.address || 'unknown';
            const fromName = mail.from?.value[0]?.name || fromEmail;
            const subject = mail.subject;
            const textBody = mail.text;

            // Find or Create Thread
            // Logic: Group by Subject + Sender Email
            // For simplicity, we use a deterministic ID based on subject for this demo
            const threadId = `email-${fromEmail}-${subject?.replace(/\s+/g, '-').toLowerCase()}`;
            
            const existingThread = await this.chatService.getThread(threadId);
            if (!existingThread) {
                await this.chatService.createThread(threadId, [{ id: fromEmail, name: fromName, email: fromEmail }]);
                await this.chatService.updateThreadMetadata(threadId, { platform: 'Email', subject: subject });
            }

            await this.chatService.saveMessage(threadId, {
                senderId: fromEmail,
                content: textBody || '(No content)',
                type: 'text'
            });
            
            this.logger.log(`Synced email from ${fromEmail}: ${subject}`);
        }

        connection.end();
    } catch (error) {
        this.logger.error(`IMAP Sync failed for ${account.email}`, error);
    }
  }

  async sendEmail(accountId: string, to: string, subject: string, text: string) {
      const account = await this.accountRepo.findOne({ where: { id: accountId } });
      if (!account) throw new Error('Account not found');

      const transporter = nodemailer.createTransport({
          host: account.smtpHost,
          port: account.smtpPort,
          secure: account.secure,
          auth: {
              user: account.username,
              pass: account.password
          }
      });

      await transporter.sendMail({
          from: `"${account.email}" <${account.email}>`,
          to,
          subject,
          text
      });
      
      return { success: true };
  }
}
