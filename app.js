const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const session = require("express-session");

dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.isAdmin = req.session.isAdmin || false;
  next();
});

const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const campDaysRoutes = require("./routes/campDays");
const aiRoutes = require("./routes/ai");

app.use("/campdays", campDaysRoutes);
app.use("/ai", aiRoutes);
app.use("/", indexRoutes);
app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);

    app.listen(port, () => {
      console.log(`Server listen on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
