export default function FilterBar({ filter, onFilterChange, sort, onSortChange }) {
    const filters = ['all', 'open', 'done'];

    return (
        <div className="filter-bar">
            {filters.map((f) => (
                <button
                    key={f}
                    className={`filter-btn ${filter === f ? 'active' : ''}`}
                    onClick={() => onFilterChange(f)}
                >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
            <select
                className="sort-select"
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
            >
                <option value="created">Sort: Created</option>
                <option value="dueDate">Sort: Due Date</option>
            </select>
        </div>
    );
}
