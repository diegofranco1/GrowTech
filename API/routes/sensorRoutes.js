const express = require('express');
const router = express.Router();
const { saveData, getLatestData } = require('../controllers/sensorController');
const authenticate = require('../middlewares/auth');
const validateData = require('../middlewares/validateData'); 
router.post('/', authenticate, validateData, saveData);
router.get('/current', authenticate, getLatestData);
module.exports = router;