const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => jwt.sign({}, process.env.JWT_SECRET, {
  subject: user.id,
  expiresIn: '1h'
});

exports.register = async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    return res.status(201).json({ token: createToken(user), expiresIn: 3600 });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo electrónico.' });
    }
    console.error('Error al registrar la cuenta:', error);
    return res.status(500).json({ error: 'No se pudo crear la cuenta.' });
  }
};

exports.login = async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  try {
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos.' });
    }
    return res.json({ token: createToken(user), expiresIn: 3600 });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email');
    if (!user) {
      return res.status(401).json({ error: 'La cuenta ya no existe. Inicia sesión nuevamente.' });
    }
    return res.json({ email: user.email });
  } catch (error) {
    console.error('Error al validar la sesión:', error);
    return res.status(500).json({ error: 'No se pudo validar la sesión.' });
  }
};
