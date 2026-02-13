import { useState, useEffect } from 'react';
import { fetchStatus } from '../services/api';

export default function Status() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const data = await fetchStatus();
                if (mounted) setStatus(data);
            } catch (err) {
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        const interval = setInterval(load, 15000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    function dotColor(value) {
        if (['healthy', 'connected', 'reachable'].includes(value)) return 'green';
        if (value === 'unconfigured') return 'yellow';
        return 'red';
    }

    function formatUptime(seconds) {
        if (!seconds && seconds !== 0) return '—';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    }

    if (loading) {
        return (
            <div className="loader-overlay">
                <div className="spinner" />
                <span className="loader-text">Checking system status…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2 className="card-title" style={{ marginBottom: 16 }}>System Status</h2>
                <div className="error-banner">
                    Unable to reach the backend: {error}
                </div>
                <div className="status-grid" style={{ marginTop: 16 }}>
                    <div className="status-card">
                        <div className="status-dot red" />
                        <div className="status-info">
                            <h3>Backend</h3>
                            <p>Unreachable</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const services = [
        { label: 'Backend', value: status.backend, detail: `Uptime: ${formatUptime(status.uptime)}` },
        { label: 'Database', value: status.database },
        { label: 'LLM (Gemini)', value: status.llm },
    ];

    return (
        <div>
            <h2 className="card-title" style={{ marginBottom: 20 }}>System Status</h2>
            <div className="status-grid">
                {services.map((svc) => (
                    <div key={svc.label} className="status-card">
                        <div className={`status-dot ${dotColor(svc.value)}`} />
                        <div className="status-info">
                            <h3>{svc.label}</h3>
                            <p>
                                {svc.value}
                                {svc.detail && <span style={{ marginLeft: 8, opacity: 0.7 }}>{svc.detail}</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
