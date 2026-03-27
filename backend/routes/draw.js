const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");


// ================= USER DRAW =================
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 🎲 generate 5 unique numbers (1–45)
    let drawNumbers = [];
    while (drawNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!drawNumbers.includes(num)) {
        drawNumbers.push(num);
      }
    }

    const userScores = user.scores.map(s => s.value);

    const matches = userScores.filter(score =>
      drawNumbers.includes(score)
    );

    res.json({
      drawNumbers,
      userScores,
      matches,
      matchCount: matches.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= 👨‍💼 GET ALL USERS (ADMIN) =================
router.get("/users", auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: "Access denied (Admin only)" });
    }

    const users = await User.find().select("-password");

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});


// ================= 🎯 ADMIN RUN GLOBAL DRAW =================
router.get("/admin-run", auth, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ msg: "Access denied (Admin only)" });
    }

    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(400).json({ msg: "No users found" });
    }

    // 🎉 pick random winner
    const winner = users[Math.floor(Math.random() * users.length)];

    res.json({
      message: "🎉 Winner selected successfully!",
      winner: {
        name: winner.name,
        email: winner.email,
        id: winner._id
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Draw error" });
  }
});


module.exports = router;