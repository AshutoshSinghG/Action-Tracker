const mongoose = require('mongoose');
const { healthCheck: llmHealthCheck } = require('../services/llmService');

const startTime = Date.now();

async function getStatus(_req, res, next) {
    try {
        let dbStatus = 'disconnected';
        try {
            await mongoose.connection.db.admin().ping();
            dbStatus = 'connected';
        } catch {
            dbStatus = 'disconnected';
        }

        const llmResult = await llmHealthCheck();

        res.json({
            backend: 'healthy',
            database: dbStatus,
            llm: llmResult.status,
            uptime: Math.floor((Date.now() - startTime) / 1000),
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getStatus };
