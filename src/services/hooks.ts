import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react';
import type { Unsubscribe } from './base';

// hook for subscribing to any service with a subscribe pattern

// eg.
//  const settings = useServiceState(
//    settingsService.subscribe.bind(settingsService),
//    settingsService.get.bind(settingsService)
//  );
 
export function useServiceState<T>(
  subscribe: (callback: (state: T) => void) => Unsubscribe,
  getSnapshot: () => T
): T {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Hook for services that need async initialization
export interface AsyncServiceState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAsyncService<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): AsyncServiceState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// hook for subscribing to a service with automatic cleanup
// where useSyncExternalStore isnt needed
export function useSubscription<T>(
  subscribe: (callback: (state: T) => void) => Unsubscribe,
  initialValue: T
): T {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, [subscribe]);

  return state;
}

// hook for one time async operations
// Returns a function to execute and loading/error states
export interface AsyncAction<TArgs extends unknown[], TResult> {
  execute: (...args: TArgs) => Promise<TResult | undefined>;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>
): AsyncAction<TArgs, TResult> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setLoading(true);
    setError(null);

    try {
      const result = await action(...args);
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
      return undefined;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [action]);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, reset };
}
