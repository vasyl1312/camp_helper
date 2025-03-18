const mongoose = require("mongoose");

const scheduleItemSchema = new mongoose.Schema({
  time: String, // "8:30-9:00"
  activity: String, // "Підйом"
  description: String, // Опціонально — деталі гри/активності
});

const campDaySchema = new mongoose.Schema({
  title: { type: String, required: true }, // "Театральний день"
  description: String, // Опис або концепція дня
  schedule: [scheduleItemSchema], // Масив активностей
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CampDay", campDaySchema);
