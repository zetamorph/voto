const express = require("express");
const middleware = require("./../middleware/middleware");
const pollController = require("./../controllers/polls");
const router = express.Router();

router.get("/polls", pollController.getPolls);
router.get("/polls/:pollId", pollController.getSinglePoll);

module.exports = router;
