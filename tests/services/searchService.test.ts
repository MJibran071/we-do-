import { describe, it, expect, beforeEach } from 'vitest';
import { searchService } from '../../services/searchService';
import { Thread, Booking, CustomerProfile, Platform, MessageStatus, Priority, BookingStatus } from '../../types';

describe('SearchService', () => {
  const mockThreads: Thread[] = [
    {
      id: 't1',
      platform: Platform.Airbnb,
      participants: [{ id: 'u1', name: 'John Doe', avatar: '', email: 'john@example.com' }],
      messages: [
        { id: 'm1', sender: { id: 'u1', name: 'John Doe', avatar: '' }, content: 'Hello, I need help', timestamp: new Date(), isMe: false }
      ],
      status: MessageStatus.Unread,
      priority: Priority.High,
      lastMessageAt: new Date(),
      summary: 'Customer inquiry'
    }
  ];

  const mockBookings: Booking[] = [
    {
      id: 'b1',
      userId: 'u1',
      guestName: 'Jane Smith',
      checkIn: new Date('2024-01-01'),
      checkOut: new Date('2024-01-05'),
      status: BookingStatus.Confirmed,
      paymentStatus: 'Paid',
      platform: Platform.Airbnb,
      totalPrice: 500,
      guests: 2
    }
  ];

  const mockCustomers: CustomerProfile[] = [
    {
      id: 'c1',
      name: 'Alice Johnson',
      avatar: '',
      email: 'alice@example.com',
      totalSpend: 1000,
      visitCount: 5,
      lastVisit: new Date(),
      status: 'Active',
      churnRisk: 'Low',
      marketingConsent: true,
      history: []
    }
  ];

  beforeEach(() => {
    searchService.buildIndex({
      threads: mockThreads,
      bookings: mockBookings,
      customers: mockCustomers
    });
  });

  it('should find threads by participant name', () => {
    const results = searchService.search('John');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('thread');
    expect(results[0].title).toBe('John Doe');
  });

  it('should find bookings by guest name', () => {
    const results = searchService.search('Jane');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('booking');
    expect(results[0].title).toBe('Jane Smith');
  });

  it('should find customers by email', () => {
    const results = searchService.search('alice@example.com');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe('customer');
  });

  it('should return empty array for no matches', () => {
    const results = searchService.search('nonexistent');
    expect(results).toEqual([]);
  });

  it('should rank results by relevance', () => {
    const results = searchService.search('john doe');
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('should apply filters correctly', () => {
    const results = searchService.search('', [
      { field: 'status', operator: 'equals', value: 'Active' }
    ]);
    expect(results.every(r => r.type === 'customer')).toBe(true);
  });

  it('should export results to CSV', () => {
    const results = searchService.search('John');
    const csv = searchService.exportToCSV(results);
    expect(csv).toContain('Type,Title,Subtitle,Score');
    expect(csv).toContain('thread');
  });
});
