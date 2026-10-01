const router = require('express').Router();
const { z } = require('zod');
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate');

const registerSchema = z.object({
  email: z.string().email(), password: z.string().min(8).max(72),
  firstName: z.string().trim().min(1).max(50), lastName: z.string().trim().min(1).max(50)
});
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
module.exports = router;
