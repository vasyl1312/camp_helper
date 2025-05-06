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
  const userPrompt = `Запропонуй ідеї для тематичного дня: "${theme}". Також напиши приблизний розклад і опис великих ігор а також реманент який потрібний. Приклад розпорядку дня : 
  8:30-9:00 - Підйом 
  9:00-9:30 - Зарядка
  9:30-10:00 - Сніданок, говоримо про гру «кіллер»
  10:30-12:00 - Квест
  12:30-14:00 - Підготовка кліпів на певну тематику де всі обєднюються в команди і потім мають показати, 
  14:00-14:30 - Обід
  14:30-16:30 - відпочинок тиха година
  16:30-17:00 - танці на вулиці
  17:00-19:00 - велика гра - Брейн ринг 
  19:00-19:30 - Вечеря 
  19:30-20:00 - Телефонуємо батькам 
  20:10-20:40 - Зворотній зв'язок  з вожатим і розмови з ним
  21:00-22:00 - показуємо Кліпи або Дискотека 
  22-30 23-00 - відбій
  `;

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
      "Ти досвідчений організатор дитячих таборів. Проаналізуй опис дня та запропонуй покращення або цікаві зміни саме цього дню який я тобі даю.";
    const userPrompt = `Ось опис дня:\n\n${scheduleText}\n\nПроаналізуй саме його та запропонуй покращення.`;

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
      "Ти досвідчений SMM-менеджер табору. Пиши яскраві описи з підпунктами для Instagram/Facebook чи TikTok.";
    const userPrompt = `Напиши пост для соцмереж для табірного дня з темою "${campDay.title}". 
Використай опис: "${campDay.description}". Зроби пост захоплюючим і дружнім для соцмереж для заохочення інших людей записуватись на табір а також батьків які спостерігають за новинами своїх дітей в таборі. Також розпиши внизу як окремим пунктом ідеї щодо фото чи відео чи постів цього дня для сторісів. `;

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
