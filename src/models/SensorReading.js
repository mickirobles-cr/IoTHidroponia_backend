const mongoose = require("mongoose");

const sensorReadingSchema = new mongoose.Schema({
  temp: { type: Number, required: true },
  ph: { type: Number, required: true },
  ec: { type: Number, required: true },
  level: { type: Number, required: true },

  deviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Device', 
    required: true 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorReading", sensorReadingSchema);
