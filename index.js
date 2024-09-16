const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const env = process.env.NODE_ENV ;

app.use(
  session({
    secret: process.env.SECRET_KEY, // Secret key for session
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(cors({
  origin: process.env.SERVER_URL,
  credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(require("./Oauth"));

require("./passport");


// Cokkies Creation
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use(cookieParser());

app.use(require("./Oauth"));

if (env === "DEVELOPMENT") {
  app.use(require("./auth"));
} else {
  app.use(`/api`, require("./auth"));
}

app.use(express.static(path.resolve(__dirname, "frontend", "docs")));

app.get("/", (req, res) => {
  console.log(path.resolve(__dirname, "frontend", "docs"));
  res.status(200).sendFile(path.resolve(__dirname, "frontend", "docs"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/docs/index.html"));
});

app.listen(PORT, () => {
  console.log("Connection Successfull at host 5000");
});
