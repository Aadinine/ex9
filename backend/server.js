const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB - Render ready
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hotel_auth";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));


// User Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  username: String,
  password: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const JWT_SECRET = 'hotel_secret_key';

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hotel Auth API - Use /register or /login" });
});

// Register User
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword
    });

    // Create token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }]
    });

    if (!user) {
      return res.json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.json({ 
        success: false, 
        message: 'Invalid password' 
      });
    }

    // Create token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Login failed' 
    });
  }
});

// Update port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Auth Server running on port ${PORT}`);
});