import React, { useState, useCallback } from 'react';
import type { ApiState } from '../types';

export function useApi<T>(
    apiFunction: (params: string) => Promise<T>,
    initialParams: string,
    dependencies: React.DependencyList = []
): ApiState<T> & { refetch: (params: string) => Promise<void> } {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (params: string) => {
        setError(null);
        try {
            const result = await apiFunction(params);
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
            setError(message);
            console.error('API Error:', err);
        }
    }, [apiFunction]);

    React.useEffect(() => {
        if (initialParams) {
            fetchData(initialParams);
        }
    }, [fetchData, initialParams, ...dependencies]);

    return { data, error, refetch: fetchData };
}