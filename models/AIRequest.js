const mongoose = require("mongoose");

const aiRequestSchema = new mongoose.Schema({
  campDayId: { type: mongoose.Schema.Types.ObjectId, ref: "CampDay" },
  prompt: String,
  aiResponse: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AIRequest", aiRequestSchema);
