/**
 * useDataSync Hook
 * Manages real-time data synchronization with backend
 * Replaces mock data with actual API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import * as dataService from '../services/dataService';
import { 
    Thread, Booking, MaintenanceIssue, CustomerProfile,
    TeamMember, Review, MessageTemplate, Apartment, Restaurant,
    KnowledgeBaseData, Integration, AIModel, TaskAssignment,
    AppMode
} from '../types';

interface DataSyncState {
    threads: Thread[];
    bookings: Booking[];
    maintenanceIssues: MaintenanceIssue[];
    customers: CustomerProfile[];
    teamMembers: TeamMember[];
    reviews: Review[];
    templates: MessageTemplate[];
    apartments: Apartment[];
    restaurants: Restaurant[];
    integrations: Integration[];
    models: AIModel[];
    taskAssignments: TaskAssignment | null;
    isLoading: boolean;
    isOnline: boolean;
    lastSync: Date | null;
}

export const useDataSync = (isAuthenticated: boolean, appMode: AppMode) => {
    const [state, setState] = useState<DataSyncState>({
        threads: [],
        bookings: [],
        maintenanceIssues: [],
        customers: [],
        teamMembers: [],
        reviews: [],
        templates: [],
        apartments: [],
        restaurants: [],
        integrations: [],
        models: [],
        taskAssignments: null,
        isLoading: true,
        isOnline: false,
        lastSync: null
    });

    // Initial data fetch
    const fetchAllData = useCallback(async () => {
        if (!isAuthenticated) return;

        setState(prev => ({ ...prev, isLoading: true }));

        try {
            // Fetch all data in parallel
            const [
                threads,
                bookings,
                maintenanceIssues,
                customers,
                teamMembers,
                reviews,
                templates,
                apartments,
                restaurants,
                integrations,
                models,
                taskAssignments
            ] = await Promise.all([
                dataService.fetchThreads(),
                dataService.fetchBookings(),
                dataService.fetchMaintenanceIssues(),
                dataService.fetchCustomers(),
                dataService.fetchTeamMembers(),
                dataService.fetchReviews(),
                dataService.fetchTemplates(),
                dataService.fetchApartments(),
                dataService.fetchRestaurants(),
                dataService.fetchIntegrations(),
                dataService.fetchModels(),
                dataService.fetchTaskAssignments()
            ]);

            setState({
                threads,
                bookings,
                maintenanceIssues,
                customers,
                teamMembers,
                reviews,
                templates,
                apartments,
                restaurants,
                integrations,
                models,
                taskAssignments,
                isLoading: false,
                isOnline: true,
                lastSync: new Date()
            });

            toast.success('Data synced', { description: 'Connected to backend server' });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setState(prev => ({ 
                ...prev, 
                isLoading: false, 
                isOnline: false 
            }));
            toast.error('Offline mode', { description: 'Could not connect to server' });
        }
    }, [isAuthenticated]);

    // Fetch data on mount and when auth changes
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Periodic sync every 30 seconds
    useEffect(() => {
        if (!isAuthenticated || !state.isOnline) return;

        const interval = setInterval(() => {
            fetchAllData();
        }, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated, state.isOnline, fetchAllData]);

    // Update functions
    const updateThread = useCallback(async (id: string, updates: Partial<Thread>) => {
        const updated = await dataService.updateThread(id, updates);
        if (updated) {
            setState(prev => ({
                ...prev,
                threads: prev.threads.map(t => t.id === id ? updated : t)
            }));
            return updated;
        }
        return null;
    }, []);

    const updateBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
        const updated = await dataService.updateBooking(id, updates);
        if (updated) {
            setState(prev => ({
                ...prev,
                bookings: prev.bookings.map(b => b.id === id ? updated : b)
            }));
            return updated;
        }
        return null;
    }, []);

    const updateMaintenanceIssue = useCallback(async (id: string, updates: Partial<MaintenanceIssue>) => {
        const updated = await dataService.updateMaintenanceIssue(id, updates);
        if (updated) {
            setState(prev => ({
                ...prev,
                maintenanceIssues: prev.maintenanceIssues.map(m => m.id === id ? updated : m)
            }));
            return updated;
        }
        return null;
    }, []);

    const updateCustomer = useCallback(async (id: string, updates: Partial<CustomerProfile>) => {
        const updated = await dataService.updateCustomer(id, updates);
        if (updated) {
            setState(prev => ({
                ...prev,
                customers: prev.customers.map(c => c.id === id ? updated : c)
            }));
            return updated;
        }
        return null;
    }, []);

    const createBooking = useCallback(async (booking: Partial<Booking>) => {
        const created = await dataService.createBooking(booking);
        if (created) {
            setState(prev => ({
                ...prev,
                bookings: [created, ...prev.bookings]
            }));
            toast.success('Booking created');
            return created;
        }
        return null;
    }, []);

    const createMaintenanceIssue = useCallback(async (issue: Partial<MaintenanceIssue>) => {
        const created = await dataService.createMaintenanceIssue(issue);
        if (created) {
            setState(prev => ({
                ...prev,
                maintenanceIssues: [created, ...prev.maintenanceIssues]
            }));
            toast.success('Issue reported');
            return created;
        }
        return null;
    }, []);

    const deleteThread = useCallback(async (id: string) => {
        const success = await dataService.deleteThread(id);
        if (success) {
            setState(prev => ({
                ...prev,
                threads: prev.threads.filter(t => t.id !== id)
            }));
            toast.success('Thread deleted');
        }
        return success;
    }, []);

    const refreshData = useCallback(() => {
        return fetchAllData();
    }, [fetchAllData]);

    return {
        ...state,
        updateThread,
        updateBooking,
        updateMaintenanceIssue,
        updateCustomer,
        createBooking,
        createMaintenanceIssue,
        deleteThread,
        refreshData,
        setThreads: (threads: Thread[]) => setState(prev => ({ ...prev, threads })),
        setBookings: (bookings: Booking[]) => setState(prev => ({ ...prev, bookings })),
        setMaintenanceIssues: (maintenanceIssues: MaintenanceIssue[]) => setState(prev => ({ ...prev, maintenanceIssues })),
        setCustomers: (customers: CustomerProfile[]) => setState(prev => ({ ...prev, customers })),
        setReviews: (reviews: Review[]) => setState(prev => ({ ...prev, reviews })),
        setTemplates: (templates: MessageTemplate[]) => setState(prev => ({ ...prev, templates })),
        setTeamMembers: (teamMembers: TeamMember[]) => setState(prev => ({ ...prev, teamMembers })),
    };
};
