// // src/app.js
// require("dotenv").config();
// const express = require("express");
// require("./data/db.js");
// const path = require("path");
// const session = require("express-session");

// const authRoute = require("./routes/authRoute");
// const gameRoute = require("./routes/gameRoute");



// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "hemmelighed",
//     resave: false,
//     saveUninitialized: false
//   })
// );

// // public filer (CSS, JS, HTML)
// app.use(express.static(path.join(__dirname, "public")));

// // startside = login.html
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "view.html"));
// });

// // beskyttet wheel-side
// app.get("/wheel", (req, res) => {
//   if (!req.session.user) {
//     return res.redirect("/");
//   }
//   res.sendFile(path.join(__dirname, "public", "wheel.html"));
// });

// // routes til login + spin-API
// app.use("/auth", authRoute);
// app.use("/game", gameRoute);


// app.listen(PORT, () => {
//   console.log(`Server kører på port ${PORT}`);
// });
// src/app.js
require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

// 
if (!process.env.SESSION_SECRET){
  throw new Error("SESSION_SECRET mangler i .env")
}

// initialiser "model/data"-laget (DB)
require("./data/db.js");

// Routes (controllers er koblet i routes-filerne)
const authRoute = require("./routes/authRoute");
const gameRoute = require("./routes/gameRoute");

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === "production";

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session-håndtering
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd, //kun true i production (kræver HTTPS)
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 2, //2 timer
    },
  })
);

// Public filer (HTML, CSS, JS) = jeres "views"
app.use(express.static(path.join(__dirname, "public")));

// Startside = view.html (login/oversigt)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "view.html"));
});

// Beskyttet wheel-side
app.get("/wheel", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "wheel.html"));
});

// API-routes (C i MVC)
app.use("/auth", authRoute);
app.use("/game", gameRoute);

// Start server (Azure bruger PORT fra env)
app.listen(PORT, () => {
  console.log(`Server kører på port ${PORT}`);
});

// valgfrit til tests, men skader ikke:
module.exports = app;
