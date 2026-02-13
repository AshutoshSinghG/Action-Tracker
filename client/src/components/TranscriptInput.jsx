import { useState } from 'react';

const MAX_LENGTH = 10000;
const MIN_LENGTH = 20;

export default function TranscriptInput({ onSubmit, loading, disabled }) {
    const [content, setContent] = useState('');

    const trimmed = content.trim();
    const tooShort = trimmed.length > 0 && trimmed.length < MIN_LENGTH;
    const tooLong = content.length > MAX_LENGTH;
    const canSubmit = trimmed.length >= MIN_LENGTH && !tooLong && !loading && !disabled;

    function handleSubmit(e) {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit(trimmed);
    }

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 className="card-title">Meeting Transcript</h2>
            <textarea
                id="transcript-input"
                className="transcript-input"
                placeholder="Paste your meeting transcript here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
            />
            <div className="input-footer">
                <span className={`char-count ${tooLong ? 'over' : ''}`}>
                    {content.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
                </span>
                <button
                    id="extract-btn"
                    type="submit"
                    className="btn btn-primary"
                    disabled={!canSubmit}
                >
                    {loading ? 'Extracting…' : 'Extract Action Items'}
                </button>
            </div>
            {tooShort && (
                <div className="error-banner" style={{ marginTop: 12 }}>
                    Transcript must be at least {MIN_LENGTH} characters.
                </div>
            )}
            {tooLong && (
                <div className="error-banner" style={{ marginTop: 12 }}>
                    Transcript exceeds the {MAX_LENGTH.toLocaleString()} character limit.
                </div>
            )}
        </form>
    );
}
