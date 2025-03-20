const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const AIRequest = require("../models/AIRequest");
const isAdmin = require("../middleware/isAdmin");
const { askAI } = require("../middleware/aiService");
const CampDay = require("../models/CampDay");

router.get("/", isAdmin, (req, res) => {
  res.render("ai/index");
});

// Генерація ідей через AI
router.post("/generate", isAdmin, async (req, res) => {
  const { theme, campDayId } = req.body;

  // Формуємо промпт
  const systemPrompt =
    "Ти досвідчений організатор дитячих таборів. Генеруй цікаві ідеї активностей для тематичних днів табору.";
  const userPrompt = `Запропонуй ідеї для тематичного дня: "${theme}".`;

  try {
    // Викликаємо сервіс для отримання відповіді від AI
    const aiResponse = await askAI(systemPrompt, userPrompt);

    // Зберігаємо запит і відповідь у базі
    const newAIRequest = new AIRequest({
      campDayId: campDayId || null,
      prompt: userPrompt,
      aiResponse,
    });
    await newAIRequest.save();

    res.render("ai/result", { aiResponse });
  } catch (error) {
    console.error("Помилка при генерації ідей:", error);
    res.status(500).json({ success: false, message: "Помилка при генерації ідей" });
  }
});

router.post("/analyze-campday/:id", isAdmin, async (req, res) => {
  try {
    const campDay = await CampDay.findById(req.params.id);
    if (!campDay) return res.status(404).send("Camp Day not found");

    const scheduleText = campDay.schedule;

    const systemPrompt =
      "Ти досвідчений організатор дитячих таборів. Проаналізуй розклад дня та запропонуй покращення або цікаві зміни.";
    const userPrompt = `Ось розклад дня:\n\n${scheduleText}\n\nПроаналізуй його та запропонуй покращення.`;

    const aiResponse = await askAI(systemPrompt, userPrompt);

    // Зберігаємо запит і відповідь
    await AIRequest.create({
      campDayId: campDay._id,
      prompt: userPrompt,
      aiResponse,
    });

    // Рендеримо edit і передаємо AI-відповідь
    res.render("campdays/edit", { campDay, aiResponse });
  } catch (err) {
    console.error("Помилка при аналізі CampDay:", err);
    res.redirect("/campdays");
  }
});

router.post("/social-content", isAdmin, async (req, res) => {
  const { campDayId } = req.body;

  try {
    const campDay = await CampDay.findById(campDayId);
    if (!campDay) {
      return res.status(404).json({ success: false, message: "Camp Day not found" });
    }

    const systemPrompt =
      "Ти досвідчений SMM-менеджер табору. Пиши яскраві описи для Instagram/Facebook.";
    const userPrompt = `Напиши пост для соцмереж для табірного дня з темою "${campDay.title}". 
Використай опис: "${campDay.description}". Зроби пост захоплюючим і дружнім для соцмереж для заохочення інших людей записуватись на табір а також батьків які спостерігають за новинами своїх дітей в таборі. і відповідь давай просто текстом без форматування жирним і тд. Можеш хіба підпункти робити і переносів рядка. Також розпиши внизу як окремим пунктом ідеї щодо фото чи відео чи постів цього і дня для сторісів. `;

    const aiResponse = await askAI(systemPrompt, userPrompt);

    // Зберігаємо запит та відповідь (для історії)
    const newAIRequest = new AIRequest({
      campDayId,
      prompt: userPrompt,
      aiResponse,
    });
    await newAIRequest.save();

    res.render("campdays/edit", {
      campDay,
      aiResponse: "Ось пропозиції щодо посту в соцмережі\n" + aiResponse,
    });
  } catch (error) {
    console.error("Помилка при генерації соцконтенту:", error);
    res.status(500).json({ success: false, message: "Помилка при генерації контенту" });
  }
});

module.exports = router;
