
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { VectorDocument } from './vector.entity';
import { Buffer } from 'buffer';
import * as fs from 'fs-extra';

@Injectable()
export class RagService implements OnModuleInit {
  private ai: GoogleGenAI;
  private readonly logger = new Logger(RagService.name);

  constructor(
    @InjectRepository(VectorDocument)
    private vectorRepo: Repository<VectorDocument>
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async onModuleInit() {
    // Ensure the vector extension is enabled in Postgres
    await this.vectorRepo.query('CREATE EXTENSION IF NOT EXISTS vector');
    await this.seedKnowledge();
  }

  private async seedKnowledge() {
    const count = await this.vectorRepo.count();
    if (count === 0) {
        this.logger.log('Seeding initial knowledge base...');
        const docs = [
            { text: "Check-in is at 3 PM. The key code is 1234.", cat: "property" },
            { text: "We do not allow pets unless a $50 deposit is paid.", cat: "property" },
            { text: "Quiet hours are from 10 PM to 8 AM daily.", cat: "property" },
            { text: "The wifi password is 'Guest123!'", cat: "property" }
        ];

        for (const doc of docs) {
            await this.addDocument(doc.text, doc.cat);
        }
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.ai.models.embedContent({
        model: 'text-embedding-004',
        contents: text,
      });
      return response.embeddings?.[0]?.values || [];
    } catch (error) {
      this.logger.error('Embedding generation failed', error);
      return [];
    }
  }

  async addDocument(content: string, category: string) {
    const embedding = await this.generateEmbedding(content);
    if (embedding.length > 0) {
      const doc = this.vectorRepo.create({
        content,
        category,
        embedding
      });
      await this.vectorRepo.save(doc);
      this.logger.log(`Document added: "${content.substring(0, 20)}..."`);
    }
  }

  // --- Hybrid Search Implementation ---
  async retrieveContext(query: string, limit: number = 3): Promise<string> {
    const results = await this.hybridSearch(query, limit);
    return results.join('\n');
  }

  async hybridSearch(query: string, limit: number = 5): Promise<string[]> {
    const embedding = await this.generateEmbedding(query);
    if (embedding.length === 0) return [];

    // 1. Vector Search (Semantic)
    const embeddingString = `[${embedding.join(',')}]`;
    const vectorResults = await this.vectorRepo
      .createQueryBuilder('doc')
      .select(['doc.id', 'doc.content'])
      .orderBy('doc.embedding <-> :embedding', 'ASC')
      .setParameters({ embedding: embeddingString })
      .limit(limit * 2)
      .getMany();

    // 2. Keyword Search (Full Text)
    let keywordResults: VectorDocument[] = [];
    try {
        keywordResults = await this.vectorRepo
        .createQueryBuilder('doc')
        .select(['doc.id', 'doc.content'])
        .where("to_tsvector('english', doc.content) @@ plainto_tsquery('english', :query)", { query })
        .limit(limit * 2)
        .getMany();
    } catch (e) {
        keywordResults = await this.vectorRepo
        .createQueryBuilder('doc')
        .select(['doc.id', 'doc.content'])
        .where("doc.content ILIKE :query", { query: `%${query}%` })
        .limit(limit * 2)
        .getMany();
    }

    // 3. Reciprocal Rank Fusion (RRF)
    const scores = new Map<string, number>();
    const contentMap = new Map<string, string>();
    const k = 60; // Smoothing constant

    const processResult = (results: VectorDocument[]) => {
        results.forEach((doc, rank) => {
            const score = 1 / (k + rank + 1);
            scores.set(doc.id, (scores.get(doc.id) || 0) + score);
            contentMap.set(doc.id, doc.content);
        });
    };

    processResult(vectorResults);
    processResult(keywordResults);

    // Sort by combined score
    const sortedIds = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(entry => entry[0]);

    return sortedIds.map(id => `- ${contentMap.get(id)}`);
  }

  async ingestDocumentFromFile(filePath: string, mimeType: string, category: string = 'general') {
      const buffer = await fs.readFile(filePath);
      return this.ingestDocument(buffer, mimeType, category);
  }

  // --- Ingestion Pipeline ---
  async ingestDocument(fileBuffer: Buffer, mimeType: string, category: string = 'general') {
      this.logger.log(`Ingesting document of type ${mimeType}...`);
      
      try {
          // 1. Extract Text using Gemini 1.5 Pro (Multimodal)
          const extractResponse = await this.ai.models.generateContent({
              model: 'gemini-1.5-pro-latest',
              contents: {
                  parts: [
                      { inlineData: { data: fileBuffer.toString('base64'), mimeType } },
                      { text: "Extract all relevant policies, rules, and information from this document. Return plain text organized by topic." }
                  ]
              }
          });

          const extractedText = extractResponse.text;
          if (!extractedText) throw new Error('No text extracted');

          // 2. Chunk Text (Simple splitting by double newline for paragraphs)
          const chunks = extractedText.split('\n\n').filter(c => c.length > 50);

          // 3. Generate Embeddings & Save
          for (const chunk of chunks) {
              await this.addDocument(chunk.trim(), category);
          }

          return { success: true, chunksProcessed: chunks.length };
      } catch (error) {
          this.logger.error('Document ingestion failed', error);
          throw error;
      }
  }
}
