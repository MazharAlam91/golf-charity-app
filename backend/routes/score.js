const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// ================= ADD SCORE =================
router.post("/add", auth, async (req, res) => {
  try {
    const { value } = req.body;

    const user = await User.findById(req.user.id);

    // keep only last 5 scores
    if (user.scores.length >= 5) {
      user.scores.shift();
    }

    user.scores.push({
      value,
      date: new Date(),
    });

    await user.save();

    res.json(user.scores);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= GET SCORES =================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json(user.scores.reverse());

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;