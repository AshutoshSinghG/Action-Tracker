import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message =
            err.response?.data?.error || err.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export function processTranscript(content) {
    return api.post('/transcripts/process', { content }).then((r) => r.data);
}

export function fetchHistory() {
    return api.get('/transcripts/history').then((r) => r.data.transcripts);
}

export function fetchTranscript(id) {
    return api.get(`/transcripts/${id}`).then((r) => r.data);
}

export function updateActionItem(id, updates) {
    return api.patch(`/action-items/${id}`, updates).then((r) => r.data);
}

export function deleteActionItem(id) {
    return api.delete(`/action-items/${id}`).then((r) => r.data);
}

export function fetchStatus() {
    return api.get('/status').then((r) => r.data);
}
