const db = require("./../db/db");
const express = require("express");
const middleware = require("./../middleware/middleware")(db);
const pollController = require("./../controllers/polls");
const router = express.Router();

router.get("/polls", pollController.getPolls);
router.get("/polls/:pollId", pollController.getSinglePoll);
router.post("/polls", middleware.requireAuth, pollController.postPoll);

module.exports = router;
