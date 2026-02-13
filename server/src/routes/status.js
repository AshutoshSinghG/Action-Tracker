const { Router } = require('express');
const ctrl = require('../controllers/statusController');

const router = Router();

router.get('/', ctrl.getStatus);

module.exports = router;
