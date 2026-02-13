import { useState, useCallback } from 'react';
import { processTranscript as processApi } from '../services/api';

export function useTranscript() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const process = useCallback(async (content) => {
        setLoading(true);
        setError(null);
        try {
            const data = await processApi(content);
            setResult(data);
            return data;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setResult(null);
        setError(null);
    }, []);

    return { process, loading, error, result, reset };
}
