const ActionItem = require('../models/ActionItem');
const { AppError } = require('../middleware/errorHandler');

async function updateItem(req, res, next) {
    try {
        const updates = {};
        const allowed = ['task', 'owner', 'dueDate', 'status', 'tags'];

        for (const field of allowed) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const item = await ActionItem.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        if (!item) throw new AppError(404, 'Action item not found');
        res.json(item);
    } catch (err) {
        next(err);
    }
}

async function deleteItem(req, res, next) {
    try {
        const item = await ActionItem.findByIdAndDelete(req.params.id);
        if (!item) throw new AppError(404, 'Action item not found');
        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
}

module.exports = { updateItem, deleteItem };
