require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARES
// ===============================
app.use(express.json());

// ===============================
// RUTAS
// ===============================
const sensorRoutes = require("./routes/sensors");
app.use("/api/sensors", sensorRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const deviceRoutes = require("./routes/devices");
app.use("/api/devices", deviceRoutes);

// ===============================
// CONEXIÓN A MONGODB
// ===============================
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI no está definida en el .env");
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB");
})
.catch((err) => {
  console.error("❌ Could not connect to MongoDB", err);
  process.exit(1);
});

// ===============================
// RUTA BASE
// ===============================
app.get("/", (req, res) => {
  res.send("✅ Server is running correctly");
});

// ===============================
// MANEJO DE ERRORES GLOBAL
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message
  });
});

// ===============================
// INICIAR SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
