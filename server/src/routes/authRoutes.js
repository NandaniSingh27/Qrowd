const express = require('express');
const router = express.Router();
const {register, login} = require('../controllers/authController');
const {registerSchema, loginSchema, validate} = require('../middleware/validators/authvalidator');
const { authLimiter } = require('../middleware/rateLimiter');


router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema),login);

module.exports = router;
