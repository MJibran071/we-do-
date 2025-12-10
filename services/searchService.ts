import { Thread, Booking, CustomerProfile, MaintenanceIssue } from '../types';

export interface SearchResult {
  type: 'thread' | 'booking' | 'customer' | 'maintenance';
  id: string;
  title: string;
  subtitle: string;
  data: any;
  score: number;
  highlights?: string[];
}

export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilter[];
  entityTypes: string[];
  createdAt: Date;
  lastUsed?: Date;
}

class SearchService {
  private index: Map<string, any> = new Map();

  // Build search index
  buildIndex(data: {
    threads?: Thread[];
    bookings?: Booking[];
    customers?: CustomerProfile[];
    maintenance?: MaintenanceIssue[];
  }) {
    this.index.clear();

    // Index threads
    data.threads?.forEach(thread => {
      const text = [
        thread.participants.map(p => p.name).join(' '),
        thread.participants.map(p => p.email).join(' '),
        thread.messages.map(m => m.content).join(' '),
        thread.summary,
        thread.platform
      ].filter(Boolean).join(' ').toLowerCase();

      this.index.set(`thread-${thread.id}`, {
        type: 'thread',
        id: thread.id,
        text,
        data: thread
      });
    });

    // Index bookings
    data.bookings?.forEach(booking => {
      const text = [
        booking.guestName,
        booking.platform,
        booking.status,
        booking.id
      ].filter(Boolean).join(' ').toLowerCase();

      this.index.set(`booking-${booking.id}`, {
        type: 'booking',
        id: booking.id,
        text,
        data: booking
      });
    });

    // Index customers
    data.customers?.forEach(customer => {
      const text = [
        customer.name,
        customer.email,
        customer.phone,
        customer.aiPersona,
        customer.tags?.join(' '),
        customer.notes
      ].filter(Boolean).join(' ').toLowerCase();

      this.index.set(`customer-${customer.id}`, {
        type: 'customer',
        id: customer.id,
        text,
        data: customer
      });
    });

    // Index maintenance
    data.maintenance?.forEach(issue => {
      const text = [
        issue.issue,
        issue.location,
        issue.priority,
        issue.status,
        issue.assignedTo
      ].filter(Boolean).join(' ').toLowerCase();

      this.index.set(`maintenance-${issue.id}`, {
        type: 'maintenance',
        id: issue.id,
        text,
        data: issue
      });
    });
  }

  // Full-text search
  search(query: string, filters?: SearchFilter[]): SearchResult[] {
    if (!query.trim()) return [];

    const terms = query.toLowerCase().split(/\s+/);
    const results: SearchResult[] = [];

    this.index.forEach((item) => {
      let score = 0;
      const highlights: string[] = [];

      // Calculate relevance score
      terms.forEach(term => {
        const count = (item.text.match(new RegExp(term, 'g')) || []).length;
        score += count;

        if (count > 0) {
          // Extract highlight context
          const regex = new RegExp(`(.{0,30}${term}.{0,30})`, 'gi');
          const matches = item.text.match(regex);
          if (matches) highlights.push(...matches.slice(0, 2));
        }
      });

      if (score > 0) {
        // Apply filters
        if (filters && !this.matchesFilters(item.data, filters)) {
          return;
        }

        results.push({
          type: item.type,
          id: item.id,
          title: this.getTitle(item),
          subtitle: this.getSubtitle(item),
          data: item.data,
          score,
          highlights: highlights.slice(0, 3)
        });
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  // Semantic search using AI (placeholder for future implementation)
  async semanticSearch(query: string): Promise<SearchResult[]> {
    // TODO: Implement with vector embeddings
    // For now, fall back to keyword search
    return this.search(query);
  }

  // Apply filters
  private matchesFilters(data: any, filters: SearchFilter[]): boolean {
    return filters.every(filter => {
      const value = this.getNestedValue(data, filter.field);

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'greater_than':
          return value > filter.value;
        case 'less_than':
          return value < filter.value;
        case 'between':
          return value >= filter.value[0] && value <= filter.value[1];
        case 'in':
          return Array.isArray(filter.value) && filter.value.includes(value);
        default:
          return true;
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }

  private getTitle(item: any): string {
    switch (item.type) {
      case 'thread':
        return item.data.participants[0]?.name || 'Unknown';
      case 'booking':
        return item.data.guestName;
      case 'customer':
        return item.data.name;
      case 'maintenance':
        return item.data.issue;
      default:
        return 'Unknown';
    }
  }

  private getSubtitle(item: any): string {
    switch (item.type) {
      case 'thread':
        return `${item.data.platform} • ${item.data.messages.length} messages`;
      case 'booking':
        return `${item.data.platform} • ${item.data.status}`;
      case 'customer':
        return `${item.data.visitCount} visits • ${item.data.status}`;
      case 'maintenance':
        return `${item.data.priority} • ${item.data.status}`;
      default:
        return '';
    }
  }

  // Export results
  exportToCSV(results: SearchResult[]): string {
    const headers = ['Type', 'Title', 'Subtitle', 'Score'];
    const rows = results.map(r => [r.type, r.title, r.subtitle, r.score]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
  }
}

export const searchService = new SearchService();

// Saved searches management
const STORAGE_KEY = 'wedo_saved_searches';

export const savedSearches = {
  getAll(): SavedSearch[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  save(search: Omit<SavedSearch, 'id' | 'createdAt'>): SavedSearch {
    const searches = this.getAll();
    const newSearch: SavedSearch = {
      ...search,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    searches.push(newSearch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    return newSearch;
  },

  delete(id: string) {
    const searches = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  },

  updateLastUsed(id: string) {
    const searches = this.getAll().map(s =>
      s.id === id ? { ...s, lastUsed: new Date() } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
  }
};
