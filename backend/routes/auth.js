const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      scores: [],
      // ✅ subscription auto default (no need to set)
    });

    await user.save();

    res.json({ msg: "User registered successfully ✅" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        subscription: user.subscription, // ✅ object now
        charity: user.charity,
        isAdmin: user.isAdmin,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= UPGRADE PLAN =================
router.post("/upgrade", auth, async (req, res) => {
  try {
    const { plan } = req.body; // 🔥 get plan (Monthly / Yearly)

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ✅ UPDATE SUBSCRIPTION OBJECT
    user.subscription = {
      plan: plan || "Monthly",
      status: "active",
    };

    await user.save();

    res.json({
      msg: "Subscription updated 🚀",
      subscription: user.subscription,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= SELECT CHARITY =================
router.post("/charity", auth, async (req, res) => {
  try {
    const { charity } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.charity = charity;
    await user.save();

    res.json({
      msg: "Charity updated ✅",
      charity: user.charity,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;