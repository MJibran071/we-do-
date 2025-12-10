
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Budget } from './budget.entity';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class FinOpsService {
  private readonly logger = new Logger(FinOpsService.name);

  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Budget)
    private budgetRepo: Repository<Budget>,
    private readonly geminiService: GeminiService
  ) {}

  async getTransactions() {
    return this.transactionRepo.find({ order: { date: 'DESC' }, take: 100 });
  }

  async addTransaction(data: Partial<Transaction>) {
    // 1. Auto-categorize using AI if missing
    if (!data.category) {
        const categorization = await this.geminiService.categorizeTransaction(data.description, Number(data.amount));
        data.category = categorization.category;
        data.vendor = categorization.vendor;
    }

    const tx = this.transactionRepo.create(data);
    const saved = await this.transactionRepo.save(tx);

    // 2. Update Budget if category matches
    await this.updateBudgetSpending(saved);

    return saved;
  }

  async createBudget(data: Partial<Budget>) {
    const budget = this.budgetRepo.create(data);
    return this.budgetRepo.save(budget);
  }

  async getBudgets() {
    return this.budgetRepo.find();
  }

  // "The Auditor" - Run this nightly via Scheduler
  async runAudit() {
    this.logger.log("Running Financial Audit...");
    const recentTransactions = await this.transactionRepo.find({
        order: { date: 'DESC' },
        take: 50
    });

    // Ask AI to find anomalies in the batch
    const analysis = await this.geminiService.analyzeFinancialAnomalies(recentTransactions);

    for (const flag of analysis.flags) {
        if (flag.transactionId) {
            await this.transactionRepo.update(flag.transactionId, {
                status: 'flagged',
                anomalyReason: flag.reason
            });
        }
    }

    return { analyzed: recentTransactions.length, anomalies: analysis.flags.length };
  }

  async getCashFlowForecast() {
      // Get last 3 months of data
      const history = await this.transactionRepo.find();
      return this.geminiService.forecastCashFlow(history);
  }

  private async updateBudgetSpending(tx: Transaction) {
      if (tx.type === 'expense') {
          // Find active budgets matching category (simplified logic)
          const budgets = await this.budgetRepo.find(); // In real app, filter by date/category
          // For demo, we just assume a budget might link manually or by name matching
          // Here we just save the tx. In a real app, we'd update budget.spentAmount
      }
  }
}
