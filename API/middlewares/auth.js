const { timingSafeEqual } = require('node:crypto');

module.exports = (req, res, next) => { 
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.API_KEY;
  const providedBytes = typeof apiKey === 'string' ? Buffer.from(apiKey) : null;
  const expectedBytes = typeof expectedKey === 'string' ? Buffer.from(expectedKey) : null;
  if (
    providedBytes !== null &&
    expectedBytes !== null &&
    providedBytes.length === expectedBytes.length &&
    timingSafeEqual(providedBytes, expectedBytes)
  ) {
    next();
  } else {
    res.status(401).json({ error: 'API Key inválida' });
  }
};