const db = require("./../db/db");
const express = require("express");
const middleware = require("./../middleware/middleware")(db);
const voteController = require("./../controllers/votes");
const router = express.Router();

router.post("/options/:optionId/votes", middleware.requireAuth, voteController.postVote);

module.exports = router;