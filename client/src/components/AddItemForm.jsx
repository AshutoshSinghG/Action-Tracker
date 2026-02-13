import { useState } from 'react';
import { processTranscript } from '../services/api';

export default function AddItemForm({ onAdd, transcriptId }) {
    const [task, setTask] = useState('');
    const [owner, setOwner] = useState('');
    const [adding, setAdding] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!task.trim()) return;

        setAdding(true);
        try {
            const item = {
                _id: `local-${Date.now()}`,
                task: task.trim(),
                owner: owner.trim() || null,
                dueDate: null,
                status: 'open',
                tags: [],
                createdAt: new Date().toISOString(),
            };
            onAdd(item);
            setTask('');
            setOwner('');
        } finally {
            setAdding(false);
        }
    }

    return (
        <form className="add-item-form" onSubmit={handleSubmit}>
            <input
                className="inline-input"
                placeholder="Add a task..."
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={adding}
            />
            <input
                className="inline-input"
                placeholder="Owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                disabled={adding}
                style={{ maxWidth: 140 }}
            />
            <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={!task.trim() || adding}
            >
                Add
            </button>
        </form>
    );
}
