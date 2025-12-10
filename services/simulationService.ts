/**
 * Simulation Service - DISABLED
 * Mock event generation has been removed in favor of real backend data
 * This file is kept for backward compatibility but returns null
 */

import { AppMode } from '../types';

export const generateRandomEvent = (appMode: AppMode): null => {
    // Simulation disabled - using real backend data only
    return null;
};
