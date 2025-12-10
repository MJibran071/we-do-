/**
 * Data Service - Real API Integration
 * Replaces mock data with actual backend API calls
 */

import { api } from '../utils/api';
import {
    Thread, Booking, MaintenanceIssue, CustomerProfile,
    TeamMember, Review, MessageTemplate, Apartment, Restaurant,
    KnowledgeBaseData, Integration, AIModel, TaskAssignment,
    Expense, InventoryItem, CallLog, AppMode
} from '../types';

// ==================== CHAT / MESSAGING ====================

export const fetchThreads = async (): Promise<Thread[]> => {
    try {
        const response = await api.get<Thread[]>('/api/chat/threads');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch threads:', error);
        return [];
    }
};

export const createThread = async (thread: Partial<Thread>): Promise<Thread | null> => {
    try {
        return await api.post<Thread>('/api/chat/threads', thread);
    } catch (error) {
        console.error('Failed to create thread:', error);
        return null;
    }
};

export const updateThread = async (id: string, updates: Partial<Thread>): Promise<Thread | null> => {
    try {
        return await api.put<Thread>(`/api/chat/threads/${id}`, updates);
    } catch (error) {
        console.error('Failed to update thread:', error);
        return null;
    }
};

export const deleteThread = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/api/chat/threads/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to delete thread:', error);
        return false;
    }
};

// ==================== BOOKINGS / RESERVATIONS ====================

export const fetchBookings = async (): Promise<Booking[]> => {
    try {
        const response = await api.get<Booking[]>('/api/operations/bookings');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return [];
    }
};

export const createBooking = async (booking: Partial<Booking>): Promise<Booking | null> => {
    try {
        return await api.post<Booking>('/api/operations/bookings', booking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        return null;
    }
};

export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<Booking | null> => {
    try {
        return await api.put<Booking>(`/api/operations/bookings/${id}`, updates);
    } catch (error) {
        console.error('Failed to update booking:', error);
        return null;
    }
};

export const deleteBooking = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/api/operations/bookings/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to delete booking:', error);
        return false;
    }
};

// ==================== MAINTENANCE ====================

export const fetchMaintenanceIssues = async (): Promise<MaintenanceIssue[]> => {
    try {
        const response = await api.get<MaintenanceIssue[]>('/api/operations/maintenance');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch maintenance issues:', error);
        return [];
    }
};

export const createMaintenanceIssue = async (issue: Partial<MaintenanceIssue>): Promise<MaintenanceIssue | null> => {
    try {
        return await api.post<MaintenanceIssue>('/api/operations/maintenance', issue);
    } catch (error) {
        console.error('Failed to create maintenance issue:', error);
        return null;
    }
};

export const updateMaintenanceIssue = async (id: string, updates: Partial<MaintenanceIssue>): Promise<MaintenanceIssue | null> => {
    try {
        return await api.put<MaintenanceIssue>(`/api/operations/maintenance/${id}`, updates);
    } catch (error) {
        console.error('Failed to update maintenance issue:', error);
        return null;
    }
};

// ==================== CUSTOMERS / CRM ====================

export const fetchCustomers = async (): Promise<CustomerProfile[]> => {
    try {
        const response = await api.get<CustomerProfile[]>('/api/crm/customers');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        return [];
    }
};

export const createCustomer = async (customer: Partial<CustomerProfile>): Promise<CustomerProfile | null> => {
    try {
        return await api.post<CustomerProfile>('/api/crm/customers', customer);
    } catch (error) {
        console.error('Failed to create customer:', error);
        return null;
    }
};

export const updateCustomer = async (id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile | null> => {
    try {
        return await api.put<CustomerProfile>(`/api/crm/customers/${id}`, updates);
    } catch (error) {
        console.error('Failed to update customer:', error);
        return null;
    }
};

// ==================== TEAM MANAGEMENT ====================

export const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    try {
        const response = await api.get<TeamMember[]>('/api/team/members');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch team members:', error);
        return [];
    }
};

export const updateTeamMember = async (id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> => {
    try {
        return await api.put<TeamMember>(`/api/team/members/${id}`, updates);
    } catch (error) {
        console.error('Failed to update team member:', error);
        return null;
    }
};

// ==================== REVIEWS ====================

export const fetchReviews = async (): Promise<Review[]> => {
    try {
        const response = await api.get<Review[]>('/api/reviews');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return [];
    }
};

export const createReview = async (review: Partial<Review>): Promise<Review | null> => {
    try {
        return await api.post<Review>('/api/reviews', review);
    } catch (error) {
        console.error('Failed to create review:', error);
        return null;
    }
};

export const updateReview = async (id: string, updates: Partial<Review>): Promise<Review | null> => {
    try {
        return await api.put<Review>(`/api/reviews/${id}`, updates);
    } catch (error) {
        console.error('Failed to update review:', error);
        return null;
    }
};

// ==================== TEMPLATES ====================

export const fetchTemplates = async (): Promise<MessageTemplate[]> => {
    try {
        const response = await api.get<MessageTemplate[]>('/api/templates');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch templates:', error);
        return [];
    }
};

export const createTemplate = async (template: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
    try {
        return await api.post<MessageTemplate>('/api/templates', template);
    } catch (error) {
        console.error('Failed to create template:', error);
        return null;
    }
};

export const updateTemplate = async (id: string, updates: Partial<MessageTemplate>): Promise<MessageTemplate | null> => {
    try {
        return await api.put<MessageTemplate>(`/api/templates/${id}`, updates);
    } catch (error) {
        console.error('Failed to update template:', error);
        return null;
    }
};

export const deleteTemplate = async (id: string): Promise<boolean> => {
    try {
        await api.delete(`/api/templates/${id}`);
        return true;
    } catch (error) {
        console.error('Failed to delete template:', error);
        return false;
    }
};

// ==================== PROPERTIES / RESTAURANTS ====================

export const fetchApartments = async (): Promise<Apartment[]> => {
    try {
        const response = await api.get<Apartment[]>('/api/properties/apartments');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch apartments:', error);
        return [];
    }
};

export const fetchRestaurants = async (): Promise<Restaurant[]> => {
    try {
        const response = await api.get<Restaurant[]>('/api/properties/restaurants');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        return [];
    }
};

export const createProperty = async (type: 'apartment' | 'restaurant', property: Partial<Apartment | Restaurant>): Promise<any> => {
    try {
        const endpoint = type === 'apartment' ? '/api/properties/apartments' : '/api/properties/restaurants';
        return await api.post(endpoint, property);
    } catch (error) {
        console.error(`Failed to create ${type}:`, error);
        return null;
    }
};

export const updateProperty = async (type: 'apartment' | 'restaurant', id: string, updates: any): Promise<any> => {
    try {
        const endpoint = type === 'apartment' ? `/api/properties/apartments/${id}` : `/api/properties/restaurants/${id}`;
        return await api.put(endpoint, updates);
    } catch (error) {
        console.error(`Failed to update ${type}:`, error);
        return null;
    }
};

// ==================== KNOWLEDGE BASE ====================

export const fetchKnowledgeBase = async (entityId: string, type: AppMode): Promise<KnowledgeBaseData | null> => {
    try {
        const endpoint = type === 'property'
            ? `/api/knowledge-base/property/${entityId}`
            : type === 'restaurant'
                ? `/api/knowledge-base/restaurant/${entityId}`
                : `/api/knowledge-base/ecommerce`;

        return await api.get<KnowledgeBaseData>(endpoint);
    } catch (error) {
        console.error('Failed to fetch knowledge base:', error);
        return null;
    }
};

export const updateKnowledgeBase = async (entityId: string, type: AppMode, data: KnowledgeBaseData): Promise<KnowledgeBaseData | null> => {
    try {
        const endpoint = type === 'property'
            ? `/api/knowledge-base/property/${entityId}`
            : type === 'restaurant'
                ? `/api/knowledge-base/restaurant/${entityId}`
                : `/api/knowledge-base/ecommerce`;

        return await api.put<KnowledgeBaseData>(endpoint, data);
    } catch (error) {
        console.error('Failed to update knowledge base:', error);
        return null;
    }
};

// ==================== INTEGRATIONS ====================

export const fetchIntegrations = async (): Promise<Integration[]> => {
    try {
        const response = await api.get<Integration[]>('/api/integrations');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch integrations:', error);
        return [];
    }
};

export const updateIntegration = async (id: string, updates: Partial<Integration>): Promise<Integration | null> => {
    try {
        return await api.put<Integration>(`/api/integrations/${id}`, updates);
    } catch (error) {
        console.error('Failed to update integration:', error);
        return null;
    }
};

// ==================== AI MODELS ====================

export const fetchModels = async (): Promise<AIModel[]> => {
    try {
        const response = await api.get<AIModel[]>('/api/ai/models');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch models:', error);
        return [];
    }
};

export const fetchTaskAssignments = async (): Promise<TaskAssignment | null> => {
    try {
        return await api.get<TaskAssignment>('/api/ai/task-assignments');
    } catch (error) {
        console.error('Failed to fetch task assignments:', error);
        return null;
    }
};

export const updateTaskAssignments = async (assignments: TaskAssignment): Promise<TaskAssignment | null> => {
    try {
        return await api.patch<TaskAssignment>('/api/ai/task-assignments', { assignments });
    } catch (error) {
        console.error('Failed to update task assignments:', error);
        return null;
    }
};

// ==================== EXPENSES ====================

export const fetchExpenses = async (): Promise<Expense[]> => {
    try {
        const response = await api.get<Expense[]>('/api/operations/expenses');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch expenses:', error);
        return [];
    }
};

export const createExpense = async (expense: Partial<Expense>): Promise<Expense | null> => {
    try {
        return await api.post<Expense>('/api/operations/expenses', expense);
    } catch (error) {
        console.error('Failed to create expense:', error);
        return null;
    }
};

// ==================== INVENTORY ====================

export const fetchInventory = async (): Promise<InventoryItem[]> => {
    try {
        const response = await api.get<InventoryItem[]>('/api/operations/inventory');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        return [];
    }
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem | null> => {
    try {
        return await api.put<InventoryItem>(`/api/operations/inventory/${id}`, updates);
    } catch (error) {
        console.error('Failed to update inventory item:', error);
        return null;
    }
};

// ==================== VOICE AGENT ====================

export const fetchCallLogs = async (): Promise<CallLog[]> => {
    try {
        const response = await api.get<CallLog[]>('/api/voice/call-logs');
        return response || [];
    } catch (error) {
        console.error('Failed to fetch call logs:', error);
        return [];
    }
};

// ==================== ANALYTICS ====================

export const fetchAnalytics = async (startDate?: Date, endDate?: Date): Promise<any> => {
    try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate.toISOString());
        if (endDate) params.append('endDate', endDate.toISOString());

        return await api.get(`/api/analytics?${params.toString()}`);
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        return null;
    }
};
