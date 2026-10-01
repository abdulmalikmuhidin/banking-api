const router = require('express').Router();
const { z } = require('zod');
const controller = require('../controllers/transfer.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');

const transferSchema = z.object({
  fromAccountId: z.string().uuid(), toAccountNumber: z.string().regex(/^\d{10,18}$/),
  amount: z.number().positive().finite().multipleOf(0.01), description: z.string().trim().max(140).optional()
});

router.post('/', authenticate, validate(transferSchema), controller.create);
module.exports = router;
