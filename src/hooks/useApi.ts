import { useState, useEffect, useCallback } from 'react';
import type { ApiState } from '../types';

export function useApi<T>(
    apiFunction: () => Promise<T>,
    dependencies: React.DependencyList = []
): ApiState<T> & { refetch: () => Promise<void> } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunction();
            setData(result);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Произошла неизвестная ошибка';
            setError(message);
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...dependencies]);

    return { data, loading, error, refetch: fetchData };
}