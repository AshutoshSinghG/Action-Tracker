import { useState, useMemo } from 'react';
import ActionItemCard from './ActionItemCard';
import AddItemForm from './AddItemForm';
import FilterBar from './FilterBar';

export default function ActionItemList({ items, onUpdate, onDelete, onToggle, onAdd }) {
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('created');

    const filtered = useMemo(() => {
        let list = [...items];

        if (filter === 'open') list = list.filter((i) => i.status === 'open');
        if (filter === 'done') list = list.filter((i) => i.status === 'done');

        list.sort((a, b) => {
            if (sort === 'dueDate') {
                const da = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
                const db = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
                return da - db;
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        return list;
    }, [items, filter, sort]);

    const openCount = items.filter((i) => i.status === 'open').length;
    const doneCount = items.filter((i) => i.status === 'done').length;

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h2 className="card-title" style={{ margin: 0 }}>
                    Action Items
                    <span style={{ fontWeight: 400, opacity: 0.6, marginLeft: 8, fontSize: '0.75rem' }}>
                        {openCount} open · {doneCount} done
                    </span>
                </h2>
            </div>

            <FilterBar
                filter={filter}
                onFilterChange={setFilter}
                sort={sort}
                onSortChange={setSort}
            />

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <p>
                        {filter !== 'all'
                            ? `No ${filter} items found.`
                            : 'No action items yet. Extract from a transcript or add one manually.'}
                    </p>
                </div>
            ) : (
                filtered.map((item) => (
                    <ActionItemCard
                        key={item._id}
                        item={item}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onToggle={onToggle}
                    />
                ))
            )}

            <AddItemForm onAdd={onAdd} />
        </div>
    );
}
