const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: String, // Назва активності (наприклад, "Підйом", "Сієста")
  description: String, // Короткий опис, для ШІ або вожатих
  suggestedDuration: String, // Рекомендована тривалість (опціонально)
});

module.exports = mongoose.model("Activity", activitySchema);
