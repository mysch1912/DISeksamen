//app.js
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");

//tjek nødvendige miljøvariabler
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET mangler i .env");
}

//initialiser "model/data" laget (DB)
require("./data/db.js");

//importer routes
const authRoute = require("./routes/authRoute");
const gameRoute = require("./routes/gameRoute");

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

//appen kører bag en proxy
app.set("trust proxy", 1);

//body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//sikkerheds headers med Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

//session-håndtering
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 2, // 2 timer
    },
  })
);

//public filer til statiske filer
app.use(express.static(path.join(__dirname, "public")));

//startside (login side) = view.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view.html"));
});

//beskyttet hjul side
app.get("/wheel", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "wheel.html"));
});

//API-routes 
app.use("/auth", authRoute);
app.use("/game", gameRoute);

//starter server
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});

module.exports = app;
