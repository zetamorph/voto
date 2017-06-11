const db = require("./../db/db");
const express = require("express");
const middleware = require("./../middleware/middleware")(db);
const optionController = require("./../controllers/options");
const router = express.Router();

router.post("/polls/:pollId/options", middleware.requireAuth, optionController.postSingleOption);

module.exports = router;