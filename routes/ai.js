const express = require("express");
const router = express.Router();
const CampDay = require("../models/CampDay");
const AIRequest = require("../models/AIRequest");

// const openai = require('../utils/openai'); // Пізніше додамо

router.get("/analyze/:id", async (req, res) => {
  const day = await CampDay.findById(req.params.id);

  // Тут виклик до OpenAI API (поки хардкод)
  const aiResponse = `AI аналіз розкладу "${day.title}" - все чудово!`;

  await AIRequest.create({
    campDayId: day._id,
    prompt: "Analyze this schedule...",
    aiResponse,
  });

  res.render("ai/analyze", { day, aiResponse });
});

module.exports = router;
