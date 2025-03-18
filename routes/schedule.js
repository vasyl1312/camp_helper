const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

// Сторінка розкладу доступна всім
router.get("/", (req, res) => {
  res.render("schedule"); // просто показ розкладу
});

// Редагування розкладу тільки для адміна
router.post("/edit", isAdmin, (req, res) => {
  // Тут логіка зміни розкладу
  res.send("Schedule updated");
});

module.exports = router;
