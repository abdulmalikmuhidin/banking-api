const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { me } = require('../controllers/user.controller');

router.get('/me', authenticate, me);
module.exports = router;
