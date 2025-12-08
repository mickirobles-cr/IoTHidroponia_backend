const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// ==========================
// ADMIN HARDCODEADO
// ==========================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Admin123!"; 

// ==========================
// VALIDADOR DE CONTRASEÑA SEGURA
// ==========================
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

// ==========================
// REGISTRO SOLO USERNAME Y PASSWORD
// ==========================
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // BLOQUEAR PASSWORD DÉBIL
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must have at least 8 characters, uppercase, lowercase, number and symbol"
      });
    }

    // BLOQUEAR REGISTRO DEL ADMIN
    if (username === ADMIN_USERNAME) {
      return res.status(403).json({ message: "Username already exists" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: "user"
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Register error", error: error.message });
  }
});

// ==========================
// LOGIN SOLO USERNAME Y PASSWORD
// ==========================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username & password required" });
    }

    // LOGIN ADMIN HARDCODEADO
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

      const token = jwt.sign(
        { userId: "ADMIN_SYSTEM", role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Admin login successful",
        token,
        user: {
          id: "ADMIN_SYSTEM",
          username: ADMIN_USERNAME,
          role: "admin"
        }
      });
    }

    // LOGIN USUARIOS NORMALES
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

// ==========================
// MIDDLEWARE DE TOKEN
// ==========================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ==========================
// RUTA PROTEGIDA NORMAL
// ==========================
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user
  });
});

// ==========================
// RUTA SOLO ADMIN
// ==========================
router.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  res.json({ message: "Welcome Admin" });
});

module.exports = router;
