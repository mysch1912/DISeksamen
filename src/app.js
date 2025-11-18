// src/app.js
require("dotenv").config();
const express = require("express");
require("./data/db.js");
const path = require("path");
const session = require("express-session");

const authRoute = require("./routes/authRoute");
const gameRoute = require("./routes/gameRoute");



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "hemmelighed",
    resave: false,
    saveUninitialized: false
  })
);

// public filer (CSS, JS, HTML)
app.use(express.static(path.join(__dirname, "public")));

// startside = login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view.html"));
});

// beskyttet wheel-side
app.get("/wheel", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "wheel.html"));
});

// routes til login + spin-API
app.use("/auth", authRoute);
app.use("/game", gameRoute);


app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});
