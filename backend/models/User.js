const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  value: Number,
  date: Date
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // 🔥 SUBSCRIPTION SYSTEM
  subscription: {
    plan: {
      type: String,
      default: "Free" // Free / Monthly / Yearly
    },
    status: {
      type: String,
      default: "inactive" // active / inactive
    }
  },

  // ❤️ Charity
  charity: {
    type: String,
    default: "None"
  },

  // 🎯 Scores
  scores: [scoreSchema],

  // 👨‍💼 ADMIN FIELD (NEW)
  isAdmin: {
    type: Boolean,
    default: false
  }

}, { timestamps: true }); // ✅ bonus (createdAt, updatedAt)

module.exports = mongoose.model("User", userSchema);