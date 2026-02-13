import { useState, useCallback } from 'react';
import {
    updateActionItem as updateApi,
    deleteActionItem as deleteApi,
} from '../services/api';

export function useActionItems(initialItems = []) {
    const [items, setItems] = useState(initialItems);

    const setAll = useCallback((newItems) => {
        setItems(newItems);
    }, []);

    const update = useCallback(async (id, updates) => {
        const updated = await updateApi(id, updates);
        setItems((prev) => prev.map((item) => (item._id === id ? updated : item)));
        return updated;
    }, []);

    const remove = useCallback(async (id) => {
        await deleteApi(id);
        setItems((prev) => prev.filter((item) => item._id !== id));
    }, []);

    const addLocal = useCallback((item) => {
        setItems((prev) => [...prev, item]);
    }, []);

    const toggleStatus = useCallback(async (id, currentStatus) => {
        const newStatus = currentStatus === 'open' ? 'done' : 'open';
        return update(id, { status: newStatus });
    }, [update]);

    return { items, setAll, update, remove, addLocal, toggleStatus };
}
