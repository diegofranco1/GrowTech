const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { register, login, getSession } = require('../controllers/authController');
const authenticateUser = require('../middlewares/userAuth');

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' }
});

const validateCredentials = [
  body('email')
    .isLength({ max: 254 })
    .isEmail()
    .withMessage('Ingresa un correo electrónico válido.')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('La contraseña es obligatoria.')
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('La contraseña debe tener entre 8 y 72 caracteres.')
    .custom((value) => Buffer.byteLength(value, 'utf8') <= 72)
    .withMessage('La contraseña no puede superar 72 bytes.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    return next();
  }
];

router.post('/register', authLimiter, validateCredentials, register);
router.post('/login', authLimiter, validateCredentials, login);
router.get('/me', authenticateUser, getSession);

module.exports = router;
