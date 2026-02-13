const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');

const SYSTEM_PROMPT = `You are a meeting assistant that extracts action items from transcripts.

Analyze the provided meeting transcript and extract every action item, task, or commitment.

Return ONLY a valid JSON array. Each element must have exactly these fields:
- "task" (string): a concise description of what needs to be done
- "owner" (string or null): the person responsible, if mentioned
- "dueDate" (string or null): ISO 8601 date string if a deadline is mentioned, otherwise null

Example output:
[
  { "task": "Send quarterly report to stakeholders", "owner": "John", "dueDate": "2025-03-15T00:00:00.000Z" },
  { "task": "Schedule follow-up meeting", "owner": null, "dueDate": null }
]

Rules:
- Output ONLY the JSON array — no markdown, no explanation, no wrapping.
- If no action items exist, return an empty array: []
- Keep task descriptions concise but complete.
- Infer owners only when explicitly stated in the transcript.`;

let genAI = null;

function getClient() {
    if (!genAI && config.geminiApiKey) {
        genAI = new GoogleGenerativeAI(config.geminiApiKey);
    }
    return genAI;
}

async function extractActionItems(transcript) {
    const client = getClient();
    if (!client) {
        console.warn('No Gemini API key configured — returning empty results');
        return [];
    }

    try {
        const model = client.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: transcript }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 2048,
            },
        });

        const text = result.response.text().trim();
        const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
        const parsed = JSON.parse(cleaned);

        if (!Array.isArray(parsed)) {
            console.warn('LLM returned non-array response — discarding');
            return [];
        }

        return parsed.map((item) => ({
            task: String(item.task || '').trim(),
            owner: item.owner ? String(item.owner).trim() : null,
            dueDate: item.dueDate || null,
        }));
    } catch (err) {
        console.error('LLM extraction failed:', err.message);
        return [];
    }
}

async function healthCheck() {
    const client = getClient();
    if (!client) return { status: 'unconfigured', detail: 'No API key set' };

    try {
        const model = client.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
        await model.generateContent('Respond with OK');
        return { status: 'reachable' };
    } catch (err) {
        return { status: 'unreachable', detail: err.message };
    }
}

module.exports = { extractActionItems, healthCheck };
