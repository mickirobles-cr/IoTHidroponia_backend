const express = require('express');
const router = express.Router();
const SensorReading = require('../models/SensorReading');
const auth = require('../middleware/auth');

// Route to post all sensor readings
router.post('/readings', auth, async (req, res) => {
    try {
        const { temp, ph, ec, level, deviceId } = req.body;
        
        if (!deviceId) {
            return res.status(400).json({ message: 'Device ID is required.' });
        }

        // Validate input
        if (temp == null || ph == null || ec == null || level == null) {
            return res.status(400).json({ message: 'All sensor readings are required.' });
        }

        const newReading = new SensorReading({ temp, ph, ec, level, deviceId });
        await newReading.save();

        res.json({ message: 'Sensor readings saved successfully.', data: newReading });
    } catch (error) {
            res.status(500).json({ message: 'Error saving sensor readings.', error: error.message });
    }
});

// Route to get the latest sensor readings
router.get('/readings', auth, async (req, res) => {
    try {
        const readings = await SensorReading.find({ deviceId: req.query.deviceId }).sort({ createdAt: -1 }).limit(100);
        res.json(readings);
    } catch (error) { 
        res.status(500).json({ message: 'Error retrieving sensor readings.', error: error.message });
    }
});

module.exports = router;    
