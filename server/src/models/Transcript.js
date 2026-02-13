const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            minlength: 20,
            maxlength: 10000,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

transcriptSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transcript', transcriptSchema);
