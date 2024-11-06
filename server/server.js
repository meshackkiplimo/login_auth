const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { connectDB } = require("./db");
const User = require("./userModel");
const auth = require("./authMiddleware");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
//

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create and send token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected route example
app.get("/api/protected", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
});
