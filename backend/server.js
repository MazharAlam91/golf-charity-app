const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // ✅ FIRST

// ================= IMPORT ROUTES =================
const authRoutes = require("./routes/auth");
const scoreRoutes = require("./routes/score");
const drawRoutes = require("./routes/draw");
const adminRoutes = require("./routes/admin"); // 🔥 NEW

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/admin", adminRoutes); // 🔥 NEW

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});