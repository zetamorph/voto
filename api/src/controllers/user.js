const express = require("express"),
      router = express.Router(),
      db = require("./../db/db.js"),
      middleware = require("./../middleware.js")(db),
      _ = require("underscore");

// POST /users/signup
// For signing up a new user

router.post("/signup", (req,res) => {
  const body = _.pick(req.body, "username", "email", "password");

  db.user.create(body).then((user) => {
    res.json(user.toPublicJSON()).end;
  }).catch((err) => {
    res.status(400).json(err).end;
  });
});

// POST /users/login
// For logging in a user

router.post("/login", (req,res) => {
  const body = _.pick(req.body, "email", "password");
  let userInstance = {};

  db.user.authenticate(body).then((user) => {
    const token = user.generateToken("authentication");
    userInstance = user;
    return db.token.create({
      token: token
    });
  }).then((tokenInstance) => {
    res.header("Auth", tokenInstance.get("token")).json(userInstance.toPublicJSON());
  }).catch((err) => {
    res.status(401).end(err.toString());
  });
});

// DELETE /users/login
// For logging out a user

router.delete("/login", middleware.requireAuth, (req,res) => {
  req.token.destroy().then(() => {
    res.status(204).render("index");
  }).catch(() => {
    res.status(500).end();
  });
});

module.exports = router;