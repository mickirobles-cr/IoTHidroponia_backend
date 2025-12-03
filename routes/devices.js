const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middleware/auth');

// Route to register a new device
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Device name is required.' });
        }

        const code = "DEV-" + Math.random().toString(36).substr(2, 9).toUpperCase();

        const newDevice = new Device({ name: name, code: code, userId: req.userId._id });
        await newDevice.save();

        res.status(201).json({ message: 'Device registered successfully.', device: newDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error registering device.', error: error.message });
    }  
});

// Route to get all devices for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const devices = await Device.find({ userId: req.userId._id });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving devices.', error: error.message });
    }
});

module.exports = router;