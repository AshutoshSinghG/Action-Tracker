import { useState, useEffect, useCallback } from 'react';
import TranscriptInput from '../components/TranscriptInput';
import ActionItemList from '../components/ActionItemList';
import HistorySidebar from '../components/HistorySidebar';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { useTranscript } from '../hooks/useTranscript';
import { useActionItems } from '../hooks/useActionItems';
import { useToast } from '../hooks/useToast';
import { fetchHistory, fetchTranscript } from '../services/api';

export default function Home() {
    const { process, loading, error } = useTranscript();
    const { items, setAll, update, remove, toggleStatus, addLocal } = useActionItems();
    const { toasts, addToast } = useToast();

    const [history, setHistory] = useState([]);
    const [activeTranscriptId, setActiveTranscriptId] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const refreshHistory = useCallback(async () => {
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        refreshHistory();
    }, [refreshHistory]);

    async function handleSubmit(content) {
        const result = await process(content);
        if (result) {
            setAll(result.actionItems);
            setActiveTranscriptId(result.transcript._id);
            addToast(
                `Extracted ${result.actionItems.length} action item${result.actionItems.length !== 1 ? 's' : ''}`,
                'success'
            );
            refreshHistory();
        }
    }

    async function handleSelectTranscript(id) {
        setLoadingHistory(true);
        try {
            const data = await fetchTranscript(id);
            setAll(data.actionItems);
            setActiveTranscriptId(id);
        } catch {
            addToast('Failed to load transcript', 'error');
        } finally {
            setLoadingHistory(false);
        }
    }

    async function handleUpdate(id, updates) {
        try {
            await update(id, updates);
            addToast('Item updated', 'success');
        } catch {
            addToast('Failed to update item', 'error');
        }
    }

    async function handleDelete(id) {
        try {
            await remove(id);
            addToast('Item deleted', 'info');
        } catch {
            addToast('Failed to delete item', 'error');
        }
    }

    async function handleToggle(id, currentStatus) {
        try {
            await toggleStatus(id, currentStatus);
        } catch {
            addToast('Failed to update status', 'error');
        }
    }

    return (
        <>
            <div className="home-grid">
                <div>
                    <TranscriptInput onSubmit={handleSubmit} loading={loading} />

                    {error && (
                        <div className="error-banner" style={{ marginTop: 16 }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ marginTop: 24 }}>
                            <Loader text="Analyzing transcript with AI..." />
                        </div>
                    ) : loadingHistory ? (
                        <div style={{ marginTop: 24 }}>
                            <Loader text="Loading action items..." />
                        </div>
                    ) : items.length > 0 || activeTranscriptId ? (
                        <div style={{ marginTop: 24 }}>
                            <ActionItemList
                                items={items}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                                onAdd={addLocal}
                            />
                        </div>
                    ) : null}
                </div>

                <HistorySidebar
                    transcripts={history}
                    activeId={activeTranscriptId}
                    onSelect={handleSelectTranscript}
                />
            </div>

            <Toast toasts={toasts} />
        </>
    );
}
