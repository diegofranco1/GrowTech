const { body, validationResult } = require('express-validator');

module.exports = [
  body('uvIndex').isFloat({ min: 0, max: 15 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];