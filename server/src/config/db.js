const mongoose = require('mongoose');
const config = require('./env');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectDB(retries = MAX_RETRIES) {
    try {
        await mongoose.connect(config.mongoUri);

        const { host, port, name } = mongoose.connection;
        console.log(`MongoDB connected: ${host}:${port}/${name}`);
    } catch (err) {
        if (retries > 0) {
            console.warn(`DB connection failed — retrying in ${RETRY_DELAY_MS / 1000}s (${retries} left)`);
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
            return connectDB(retries - 1);
        }
        console.error('MongoDB connection failed after retries:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
