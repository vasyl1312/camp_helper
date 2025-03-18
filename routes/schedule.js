const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");

// Тимчасовий масив розкладу (можна замінити на базу потім)
let schedule = [
  { time: "8:30-9:00", activity: "Wake Up" },
  { time: "9:00-9:30", activity: "Morning Exercise" },
  { time: "9:30-10:00", activity: "Breakfast" },
];

// Показ розкладу
router.get("/", (req, res) => {
  res.render("schedule", {
    schedule,
    isAdmin: req.session.isAdmin,
  });
});

// Редагування розкладу тільки для адміна
router.post("/edit", isAdmin, (req, res) => {
  const { time, activity } = req.body;
  if (time && activity) {
    schedule.push({ time, activity });
  }
  res.redirect("/schedule");
});

module.exports = router;
