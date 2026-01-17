import { invoke as tauriInvoke } from '@tauri-apps/api/core';

// listener type for subscription services
export type Listener<T> = (state: T) => void;

// unsubscribe function returned by subscribe methods
export type Unsubscribe = () => void;

export interface InvokeOptions {
    context?: string;
    rethrow?: boolean;
}

export async function invoke<T>(
    command: string,
    args?: Record<string, unknown>,
    options: InvokeOptions = {}
): Promise<T | null> {
    const { context = command, rethrow = false } = options;

    try {
        return await tauriInvoke<T>(command, args);
    } catch (error) {
        console.error(`[${context}]`, error);
        if (rethrow) throw error;
        return null;
    }
}

// invoke that always throws on error 
export async function invokeRequired<T>(
    command: string,
    args?: Record<string, unknown>,
    context?: string
): Promise<T> {
    const result = await invoke<T>(command, args, { context, rethrow: true });
    return result as T;
}

// base class for subscription-based services
export abstract class BaseService<TState> {
    protected listeners: Listener<TState>[] = [];
    protected initialized = false;

    protected abstract getSnapshot(): TState;

    // subscribe to state changes
    subscribe(fn: Listener<TState>): Unsubscribe {
        this.listeners.push(fn);

        if (this.initialized) {
            fn(this.getSnapshot());
        }

        return () => {
            this.listeners = this.listeners.filter((l) => l !== fn);
        };
    }

    // notify all subscribers of state change
    protected notify(): void {
        const snapshot = this.getSnapshot();
        this.listeners.forEach((l) => l(snapshot));
    }

    // mark service as initialized and notify subscribers
    protected markInitialized(): void {
        this.initialized = true;
        this.notify();
    }

    isInitialized(): boolean {
        return this.initialized;
    }
}

// utility to create a singleton service instance
export function createSingleton<T>(factory: () => T): () => T {
    let instance: T | null = null;

    return () => {
        if (!instance) {
            instance = factory();
        }
        return instance;
    };
}

// debounce utility for rate-limiting operations
// useful for autosave, search etc
export function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): T & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debounced = ((...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    }) as T & { cancel: () => void };

    debounced.cancel = () => {
        if (timeoutId) clearTimeout(timeoutId);
    };

    return debounced;
}

// throttle utility for limiting execution frequency
// useful for scroll handlers, resize events etc
export function throttle<T extends (...args: Parameters<T>) => void>(
    fn: T,
    limit: number
): T {
    let inThrottle = false;

    return ((...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => { inThrottle = false; }, limit);
        }
    }) as T;
}
