const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// ✅ Check Admin Middleware
const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ msg: "Access denied ❌" });
  }

  next();
};

// ================= VIEW USERS =================
router.get("/users", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ================= RUN DRAW =================
router.post("/draw", auth, isAdmin, async (req, res) => {
  const numbers = Array.from({ length: 5 }, () =>
    Math.floor(Math.random() * 10)
  );

  res.json({
    msg: "Draw executed 🎲",
    numbers,
  });
});

module.exports = router;