const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true }, // ESTE VA EN LA ETIQUETA
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}, { timestamps: true });

module.exports = mongoose.model("Device", DeviceSchema);
