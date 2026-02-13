import { useState } from 'react';

export default function ActionItemCard({ item, onUpdate, onDelete, onToggle }) {
    const [editing, setEditing] = useState(false);
    const [task, setTask] = useState(item.task);
    const [owner, setOwner] = useState(item.owner || '');
    const [dueDate, setDueDate] = useState(
        item.dueDate ? item.dueDate.slice(0, 10) : ''
    );

    const isDone = item.status === 'done';

    async function handleSave() {
        await onUpdate(item._id, {
            task,
            owner: owner || null,
            dueDate: dueDate || null,
        });
        setEditing(false);
    }

    function handleCancel() {
        setTask(item.task);
        setOwner(item.owner || '');
        setDueDate(item.dueDate ? item.dueDate.slice(0, 10) : '');
        setEditing(false);
    }

    function formatDate(d) {
        if (!d) return null;
        return new Date(d).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    }

    return (
        <div className={`action-item ${isDone ? 'done' : ''}`}>
            <button
                className={`item-checkbox ${isDone ? 'checked' : ''}`}
                onClick={() => onToggle(item._id, item.status)}
                title={isDone ? 'Mark open' : 'Mark done'}
            >
                {isDone ? '✓' : ''}
            </button>

            <div className="item-body">
                {editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                            className="inline-input"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Task description"
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                className="inline-input"
                                value={owner}
                                onChange={(e) => setOwner(e.target.value)}
                                placeholder="Owner"
                                style={{ flex: 1 }}
                            />
                            <input
                                className="inline-input"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>
                                Save
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="item-task">{item.task}</div>
                        <div className="item-meta">
                            {item.owner && <span>👤 {item.owner}</span>}
                            {item.dueDate && <span>📅 {formatDate(item.dueDate)}</span>}
                            {item.tags?.map((tag) => (
                                <span key={tag} className={`tag ${tag}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {!editing && (
                <div className="item-actions">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setEditing(true)}
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(item._id)}
                        title="Delete"
                    >
                        🗑
                    </button>
                </div>
            )}
        </div>
    );
}
