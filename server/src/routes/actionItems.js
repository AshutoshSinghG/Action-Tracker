const { Router } = require('express');
const { param, body } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/actionItemController');

const router = Router();

const idCheck = param('id').isMongoId().withMessage('Invalid action item ID');

router.patch(
    '/:id',
    [
        idCheck,
        body('task').optional().isString().trim().notEmpty().withMessage('Task cannot be empty'),
        body('owner').optional({ values: 'null' }).isString().trim(),
        body('dueDate').optional({ values: 'null' }).isISO8601().withMessage('Invalid date format'),
        body('status').optional().isIn(['open', 'done']).withMessage('Status must be open or done'),
        body('tags').optional().isArray().withMessage('Tags must be an array'),
        validate,
    ],
    ctrl.updateItem
);

router.delete('/:id', [idCheck, validate], ctrl.deleteItem);

module.exports = router;
