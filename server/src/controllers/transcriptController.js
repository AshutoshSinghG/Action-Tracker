const transcriptService = require('../services/transcriptService');
const { AppError } = require('../middleware/errorHandler');

async function processTranscript(req, res, next) {
    try {
        const { content } = req.body;
        const result = await transcriptService.processTranscript(content);

        res.status(201).json({
            transcript: {
                _id: result.transcript._id,
                content: result.transcript.content,
                createdAt: result.transcript.createdAt,
            },
            actionItems: result.actionItems,
        });
    } catch (err) {
        next(err);
    }
}

async function getHistory(_req, res, next) {
    try {
        const transcripts = await transcriptService.getHistory();
        res.json({ transcripts });
    } catch (err) {
        next(err);
    }
}

async function getById(req, res, next) {
    try {
        const result = await transcriptService.getTranscriptWithItems(req.params.id);
        if (!result) throw new AppError(404, 'Transcript not found');
        res.json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { processTranscript, getHistory, getById };
