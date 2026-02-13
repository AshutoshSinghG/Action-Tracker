const { Router } = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/transcriptController');

const router = Router();

router.post(
    '/process',
    [
        body('content')
            .isString()
            .withMessage('Transcript content must be a string')
            .trim()
            .isLength({ min: 20 })
            .withMessage('Transcript must be at least 20 characters')
            .isLength({ max: 10000 })
            .withMessage('Transcript must not exceed 10,000 characters'),
        validate,
    ],
    ctrl.processTranscript
);

router.get('/history', ctrl.getHistory);

router.get(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid transcript ID'),
        validate,
    ],
    ctrl.getById
);

module.exports = router;
