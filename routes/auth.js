const express = require("express");
const { isAuthorized } = require("../middleware/authUtils");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (isAuthorized(username, password, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)) {
    req.session.isAdmin = true;
    res.redirect("/campdays");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
