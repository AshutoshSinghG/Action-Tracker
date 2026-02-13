const Transcript = require('../models/Transcript');
const ActionItem = require('../models/ActionItem');
const { extractActionItems } = require('./llmService');

async function processTranscript(content) {
    const transcript = await Transcript.create({ content });

    const extracted = await extractActionItems(content);

    const items = await ActionItem.insertMany(
        extracted.map((item) => ({
            transcriptId: transcript._id,
            task: item.task,
            owner: item.owner,
            dueDate: item.dueDate,
        }))
    );

    return { transcript, actionItems: items };
}

async function getHistory(limit = 5) {
    return Transcript.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('content createdAt')
        .lean();
}

async function getTranscriptWithItems(transcriptId) {
    const transcript = await Transcript.findById(transcriptId).lean();
    if (!transcript) return null;

    const actionItems = await ActionItem.find({ transcriptId })
        .sort({ createdAt: 1 })
        .lean();

    return { transcript, actionItems };
}

module.exports = { processTranscript, getHistory, getTranscriptWithItems };
