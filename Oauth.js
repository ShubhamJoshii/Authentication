const express = require("express");
const router = express();
const passport = require("passport");
const env = process.env.NODE_ENV ;


router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/auth/facebook",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);
router.get("/auth/facebook/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/auth/github",
  passport.authenticate("github", {
    scope: ['user:email']
  })
);

router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const { token, user } = req.user;
    res.cookie("AuthToken", token, {
      expires: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    return  env=== "PRODUCTION" ? res.redirect("/") : res.redirect("http://localhost:3000/");
  }
  res.redirect("/");
});

module.exports = router;
