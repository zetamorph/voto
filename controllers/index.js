const express = require('express'),
      router = express.Router();

router.use("/api", require("./api.js"));
router.use("/users", require("./user.js"));

// GET /
// This will render index.pug where VueJS is mounted in #app

router.get("/", (req,res) => {
  res.render("index");
});

module.exports = router;