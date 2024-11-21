const express = require('express');
const router = express.Router();
const { getDevices, updateDeviceData } = require('../controllers/deviceController');
const auth = require('../middleware/auth');

// Get devices (protected route)
router.get('/', auth, getDevices);

// Update device data
router.post('/update', updateDeviceData);

module.exports = router;
