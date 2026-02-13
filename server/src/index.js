const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/env');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const transcriptRoutes = require('./routes/transcripts');
const actionItemRoutes = require('./routes/actionItems');
const statusRoutes = require('./routes/status');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientOrigin }));
app.use(express.json({ limit: '50kb' }));

if (!config.isProduction) {
    app.use(morgan('dev'));
}

app.use('/api/transcripts', transcriptRoutes);
app.use('/api/action-items', actionItemRoutes);
app.use('/api/status', statusRoutes);

app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

async function start() {
    await connectDB();
    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port} [${config.nodeEnv}]`);
    });
}

start();

module.exports = app;
