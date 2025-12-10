import { Thread, Booking, CustomerProfile, MaintenanceIssue, KnowledgeBaseData } from '../types';

export interface BackupData {
  version: string;
  timestamp: Date;
  data: {
    threads: Thread[];
    bookings: Booking[];
    customers: CustomerProfile[];
    maintenance: MaintenanceIssue[];
    knowledgeBases: Record<string, KnowledgeBaseData>;
  };
  metadata: {
    recordCount: number;
    size: number;
  };
}

export interface BackupInfo {
  id: string;
  timestamp: Date;
  size: number;
  recordCount: number;
  type: 'manual' | 'automatic';
}

class BackupService {
  private readonly BACKUP_KEY_PREFIX = 'wedo_backup_';
  private readonly MAX_BACKUPS = 10;
  private readonly AUTO_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

  // Create backup
  async createBackup(data: BackupData['data'], type: 'manual' | 'automatic' = 'manual'): Promise<BackupInfo> {
    const backup: BackupData = {
      version: '1.0',
      timestamp: new Date(),
      data,
      metadata: {
        recordCount: this.countRecords(data),
        size: 0
      }
    };

    const serialized = JSON.stringify(backup);
    backup.metadata.size = new Blob([serialized]).size;

    const backupId = `${this.BACKUP_KEY_PREFIX}${Date.now()}`;
    
    try {
      // Store in localStorage (for demo - in production use cloud storage)
      localStorage.setItem(backupId, serialized);

      // Clean old backups
      await this.cleanOldBackups();

      const info: BackupInfo = {
        id: backupId,
        timestamp: backup.timestamp,
        size: backup.metadata.size,
        recordCount: backup.metadata.recordCount,
        type
      };

      // Update backup list
      this.updateBackupList(info);

      return info;
    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  // Restore from backup
  async restoreBackup(backupId: string): Promise<BackupData['data']> {
    try {
      const serialized = localStorage.getItem(backupId);
      if (!serialized) {
        throw new Error('Backup not found');
      }

      const backup: BackupData = JSON.parse(serialized);
      
      // Validate backup
      if (!this.validateBackup(backup)) {
        throw new Error('Invalid backup data');
      }

      return backup.data;
    } catch (error) {
      console.error('Restore failed:', error);
      throw new Error('Failed to restore backup');
    }
  }

  // List all backups
  listBackups(): BackupInfo[] {
    const listKey = 'wedo_backup_list';
    const stored = localStorage.getItem(listKey);
    if (!stored) return [];

    try {
      return JSON.parse(stored).map((info: any) => ({
        ...info,
        timestamp: new Date(info.timestamp)
      }));
    } catch {
      return [];
    }
  }

  // Delete backup
  async deleteBackup(backupId: string): Promise<void> {
    localStorage.removeItem(backupId);
    
    const list = this.listBackups().filter(b => b.id !== backupId);
    localStorage.setItem('wedo_backup_list', JSON.stringify(list));
  }

  // Export backup to file
  async exportBackup(backupId: string): Promise<void> {
    const serialized = localStorage.getItem(backupId);
    if (!serialized) {
      throw new Error('Backup not found');
    }

    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Import backup from file
  async importBackup(file: File): Promise<BackupInfo> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backup: BackupData = JSON.parse(content);

          if (!this.validateBackup(backup)) {
            reject(new Error('Invalid backup file'));
            return;
          }

          const backupId = `${this.BACKUP_KEY_PREFIX}${Date.now()}`;
          localStorage.setItem(backupId, content);

          const info: BackupInfo = {
            id: backupId,
            timestamp: new Date(backup.timestamp),
            size: new Blob([content]).size,
            recordCount: backup.metadata.recordCount,
            type: 'manual'
          };

          this.updateBackupList(info);
          resolve(info);
        } catch (error) {
          reject(new Error('Failed to import backup'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Setup automatic backups
  setupAutoBackup(getData: () => BackupData['data']) {
    const lastBackup = localStorage.getItem('wedo_last_auto_backup');
    const lastBackupTime = lastBackup ? new Date(lastBackup).getTime() : 0;
    const now = Date.now();

    if (now - lastBackupTime > this.AUTO_BACKUP_INTERVAL) {
      this.createBackup(getData(), 'automatic');
      localStorage.setItem('wedo_last_auto_backup', new Date().toISOString());
    }

    // Schedule next auto backup
    setInterval(() => {
      this.createBackup(getData(), 'automatic');
      localStorage.setItem('wedo_last_auto_backup', new Date().toISOString());
    }, this.AUTO_BACKUP_INTERVAL);
  }

  // Point-in-time recovery
  async getBackupAtTime(targetTime: Date): Promise<BackupInfo | null> {
    const backups = this.listBackups()
      .filter(b => b.timestamp <= targetTime)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return backups[0] || null;
  }

  // Validate backup integrity
  private validateBackup(backup: BackupData): boolean {
    if (!backup.version || !backup.timestamp || !backup.data) {
      return false;
    }

    const { data } = backup;
    if (!Array.isArray(data.threads) || !Array.isArray(data.bookings)) {
      return false;
    }

    return true;
  }

  // Count records in backup
  private countRecords(data: BackupData['data']): number {
    return (
      (data.threads?.length || 0) +
      (data.bookings?.length || 0) +
      (data.customers?.length || 0) +
      (data.maintenance?.length || 0)
    );
  }

  // Clean old backups
  private async cleanOldBackups(): Promise<void> {
    const backups = this.listBackups()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (backups.length > this.MAX_BACKUPS) {
      const toDelete = backups.slice(this.MAX_BACKUPS);
      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }
    }
  }

  // Update backup list
  private updateBackupList(info: BackupInfo): void {
    const list = this.listBackups();
    list.push(info);
    localStorage.setItem('wedo_backup_list', JSON.stringify(list));
  }

  // Get backup statistics
  getStatistics(): {
    totalBackups: number;
    totalSize: number;
    oldestBackup: Date | null;
    newestBackup: Date | null;
    automaticBackups: number;
    manualBackups: number;
  } {
    const backups = this.listBackups();

    return {
      totalBackups: backups.length,
      totalSize: backups.reduce((sum, b) => sum + b.size, 0),
      oldestBackup: backups.length > 0 
        ? new Date(Math.min(...backups.map(b => b.timestamp.getTime())))
        : null,
      newestBackup: backups.length > 0
        ? new Date(Math.max(...backups.map(b => b.timestamp.getTime())))
        : null,
      automaticBackups: backups.filter(b => b.type === 'automatic').length,
      manualBackups: backups.filter(b => b.type === 'manual').length
    };
  }
}

export const backupService = new BackupService();
