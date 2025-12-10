const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Device = require('../models/Device');
const SensorReading = require('../models/SensorReading');

// ===============================
// REGISTRAR LECTURA DEL SENSOR (ARDUINO)
// ===============================
router.post('/reading', async (req, res) => {
  try {
    const { deviceCode, temp, ph, ec, level } = req.body;

    if (!deviceCode || temp == null || ph == null || ec == null || level == null) {
      return res.status(400).json({
        message: 'All sensor fields and deviceCode are required.'
      });
    }

    // ✅ Buscar el dispositivo por su código
    const device = await Device.findOne({ code: deviceCode });
    if (!device) {
      return res.status(404).json({
        message: 'Device not found.'
      });
    }

    // ✅ Guardar lectura
    const newReading = new SensorReading({
      temp,
      ph,
      ec,
      level,
      deviceId: device._id
    });

    await newReading.save();

    res.status(201).json({
      message: 'Sensor data saved successfully.',
      reading: newReading
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error saving sensor data.',
      error: error.message
    });
  }
});

// ===============================
// OBTENER LECTURAS DE UN DEVICE (APP / WEB)
// ===============================
router.get('/reading/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;

    const readings = await SensorReading.find({ deviceId })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(readings);

  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving sensor data.',
      error: error.message
    });
  }
});

module.exports = router;
