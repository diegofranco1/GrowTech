const express = require('express');
const router = express.Router();
const { saveData, getLatestData } = require('../controllers/sensorController');
const authenticateSensor = require('../middlewares/auth');
const authenticateUser = require('../middlewares/userAuth');
const validateData = require('../middlewares/validateData'); 
router.post('/', authenticateSensor, validateData, saveData);
router.get('/current', authenticateUser, getLatestData);
module.exports = router;