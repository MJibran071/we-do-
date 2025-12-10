

import { Thread, Booking, AIConfig, KnowledgeBaseData, AIModel, Integration, Apartment } from '../types';

// Helper to revive Dates from JSON
const dateReviver = (key: string, value: any) => {
    const dateKeys = ['timestamp', 'lastMessageAt', 'checkIn', 'checkOut', 'lastSync', 'reportedAt'];
    if (dateKeys.includes(key) && typeof value === 'string') {
        return new Date(value);
    }
    return value;
};

export const saveToStorage = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to local storage', e);
    }
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return fallback;
        return JSON.parse(item, dateReviver) as T;
    } catch (e) {
        console.error('Failed to load from local storage', e);
        return fallback;
    }
};

export const KEYS = {
    THREADS: 'wedo_threads_v2',
    BOOKINGS: 'wedo_bookings_v1',
    CONFIG: 'wedo_config_v1',
    KB_PROPERTY: 'wedo_kb_prop_v1',
    KB_ECOMMERCE: 'wedo_kb_ecom_v1',
    APARTMENTS: 'wedo_apartments_v1',
    THEME: 'wedo_theme_v1',
    APP_MODE: 'wedo_mode_v1',
    SUBSCRIPTION: 'wedo_subscription_v1',
    ONBOARDING_COMPLETE: 'wedo_onboarding_complete_v1'
};