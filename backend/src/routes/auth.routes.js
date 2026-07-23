const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  registerSchema,
  loginSchema,
} = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

module.exports = router;
