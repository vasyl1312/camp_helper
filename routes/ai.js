const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config(); // Підключення dotenv для роботи з змінними середовища

const AIRequest = require("../models/AIRequest");
const isAdmin = require("../middleware/isAdmin");

router.get("/", isAdmin, (req, res) => {
  res.render("ai/index");
});

router.post("/generate", isAdmin, async (req, res) => {
  const { theme, campDayId } = req.body;

  const systemPrompt =
    "Ти досвідчений організатор дитячих таборів. Генеруй цікаві ідеї активностей для тематичних днів табору.";
  const userPrompt = `Запропонуй ідеї для тематичного дня: "${theme}".`;

  try {
    const response = await axios.post(
      "https://models.inference.ai.azure.com/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        model: "gpt-4o-mini",
        temperature: 1,
        max_tokens: 4096,
        top_p: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Отримуємо відповідь від AI
    const aiResponse = response.data.choices[0].message.content;

    // Зберігаємо запит у базі даних (якщо потрібно)
    // const newAIRequest = new AIRequest({
    //   theme,
    //   campDayId,
    //   response: aiResponse,
    // });
    // await newAIRequest.save();

    res.render("ai/result", { aiResponse });

    // Відправляємо відповідь клієнту
    // res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Помилка при запиті до AI:", error);
    res.status(500).json({ success: false, message: "Помилка при генерації ідей" });
  }
});

module.exports = router;
