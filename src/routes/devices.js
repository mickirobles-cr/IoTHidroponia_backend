const express = require("express");
const router = express.Router();
const Device = require("../models/Device");
const auth = require("../middleware/auth");

// ✅ USUARIO RECLAMA DEVICE POR CODE
router.post("/claim", auth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Device code is required" });
    }

    const device = await Device.findOne({ code });

    if (!device) {
      return res.status(404).json({ message: "Device no encontrado" });
    }

    if (device.owner) {
      return res.status(400).json({ message: "Este device ya fue reclamado por otro usuario" });
    }

    device.owner = req.userId;
    await device.save();

    res.json({
      message: "Device reclamado correctamente",
      device
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al reclamar device",
      error: error.message
    });
  }
});

// ✅ USUARIO VE SOLO SUS DEVICES
router.get("/", auth, async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.userId });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo devices" });
  }
});

module.exports = router;
