const { body, validationResult } = require('express-validator');

module.exports = [
  body('uvIndex').isFloat({ min: 0, max: 15 }).toFloat(),
  body('temperature').isFloat().toFloat(),
  body('soilHumidity').isFloat({ min: 0, max: 100 }).toFloat(),
  body('color').optional({ nullable: true }).isObject(),
  body('color.light').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('color.red').optional({ nullable: true }).isInt({ min: 0, max: 255 }).toInt(),
  body('color.green').optional({ nullable: true }).isInt({ min: 0, max: 255 }).toInt(),
  body('color.blue').optional({ nullable: true }).isInt({ min: 0, max: 255 }).toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Datos de sensores inválidos.', errors: errors.array() });
    }
    next();
  }
];