const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const auth = require('../middleware/auth');

// ==========================
// REGISTER A NEW DEVICE
// ==========================
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Device name is required.' });
    }

    const code = "DEV-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const newDevice = new Device({ name, code, userId: req.userId._id });
    await newDevice.save();

    res.status(201).json({ message: 'Device registered successfully.', device: newDevice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering device.', error: error.message });
  }
});

// ==========================
// GET ALL DEVICES FOR USER
// ==========================
router.get('/', auth, async (req, res) => {
  try {
    if (!req.userId || !req.userId._id) {
      // Esto previene que la app reciba undefined
      return res.json([]);
    }

    const devices = await Device.find({ userId: req.userId._id });

    // Siempre devuelve un array, aunque no tenga dispositivos
    res.json(Array.isArray(devices) ? devices : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving devices.', error: error.message });
  }
});

module.exports = router;
