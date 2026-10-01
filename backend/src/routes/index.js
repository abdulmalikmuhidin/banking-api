const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/accounts', require('./account.routes'));
router.use('/transfers', require('./transfer.routes'));
module.exports = router;
