export default function HistorySidebar({ transcripts, activeId, onSelect }) {
    function formatTime(dateStr) {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    function preview(content) {
        return content.length > 120 ? content.slice(0, 120) + '…' : content;
    }

    return (
        <div className="card">
            <h2 className="card-title">Recent Transcripts</h2>

            {transcripts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <p>No transcripts yet. Process your first meeting above.</p>
                </div>
            ) : (
                <div className="history-list">
                    {transcripts.map((t) => (
                        <div
                            key={t._id}
                            className={`history-item ${activeId === t._id ? 'active' : ''}`}
                            onClick={() => onSelect(t._id)}
                        >
                            <div className="history-preview">{preview(t.content)}</div>
                            <div className="history-time">{formatTime(t.createdAt)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
