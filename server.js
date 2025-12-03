require("dotenv").config();
const express = require("express");

const app = express();  
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

app.use(express.json());

const sensorRoutes = require("./routes/sensors");
app.use("/api/sensors", sensorRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const deviceRoutes = require("./routes/devices");
app.use("/api/devices", deviceRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {console.log("Connected to MongoDB")})
    .catch((err) => {console.error("Could not connect to MongoDB", err)});
    

app.get("/", (req, res) => {
    res.send("server is running");  
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});