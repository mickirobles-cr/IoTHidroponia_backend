const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema({
    temp: Number,
    ph: Number,
    ec: Number,
    level: Number,
    deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorReading", sensorReadingSchema);