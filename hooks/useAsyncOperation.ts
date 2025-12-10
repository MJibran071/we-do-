/**
 * Custom hook for managing async operations with loading, error, and data states
 * Provides a clean API for handling async functions in React components
 */

import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';
import { getErrorMessage } from '../utils/typeGuards';

interface UseAsyncOperationResult<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  loading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

/**
 * Hook for managing async operations
 * @param asyncFunction - The async function to execute
 * @returns Object with execute function, loading state, error state, data, and reset function
 */
export function useAsyncOperation<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncOperationResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | undefined> => {
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        const error = new Error(errorMessage);
        setError(error);
        logger.error('Async operation failed', err);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
}


