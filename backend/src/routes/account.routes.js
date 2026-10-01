const router = require('express').Router();
const controller = require('../controllers/account.controller');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.get('/:id/transactions', controller.transactions);
module.exports = router;
