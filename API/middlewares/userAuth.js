const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = typeof authorization === 'string' && authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Debes iniciar sesión para consultar las lecturas.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload !== 'object' || typeof payload.sub !== 'string') {
      return res.status(401).json({ error: 'La sesión no es válida. Inicia sesión nuevamente.' });
    }

    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ error: 'La sesión expiró o no es válida. Inicia sesión nuevamente.' });
  }
};
