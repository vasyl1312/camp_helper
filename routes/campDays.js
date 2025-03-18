const express = require("express");
const router = express.Router();
const CampDay = require("../models/CampDay");
const isAdmin = require("../middleware/isAdmin");

// Список всіх днів
router.get("/", async (req, res) => {
  const days = await CampDay.find();
  res.render("campdays/index", { days });
});

// Форма створення
router.get("/new", isAdmin, (req, res) => {
  res.render("campdays/new");
});

// Створення дня
router.post("/", isAdmin, async (req, res) => {
  const { title, description, schedule } = req.body;
  await CampDay.create({ title, description, schedule });
  res.redirect("/campdays");
});

// Перегляд конкретного дня
router.get("/:id", async (req, res) => {
  const day = await CampDay.findById(req.params.id);
  res.render("campdays/show", { day });
});

// Форма редагування
router.get("/:id/edit", isAdmin, async (req, res) => {
  const day = await CampDay.findById(req.params.id);
  res.render("campdays/edit", { day });
});

// Оновлення
router.post("/:id", isAdmin, async (req, res) => {
  await CampDay.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/campdays/${req.params.id}`);
});

// Видалення
router.post("/:id/delete", isAdmin, async (req, res) => {
  await CampDay.findByIdAndDelete(req.params.id);
  res.redirect("/campdays");
});

module.exports = router;
