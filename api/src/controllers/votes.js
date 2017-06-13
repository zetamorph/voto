const db = require("./../db/db");
const _ = require("lodash");

module.exports = {
  postVote(req,res) {
    const voteData = {
      userId: req.user.id,
      optionId: req.params.optionId
    };
    let pollId;

    db.option.findById(voteData.optionId)
    .then((option) => {
      pollId = option.dataValues.pollId;
      return db.option.findAll({
        where: {
          pollId: pollId
        }
      });
    })
    .then((options) => {
      const optionIds = [];
      options.forEach((el, index, arr) => {
        optionIds.push(el.dataValues.id);
      });
      return db.vote.findOne({
        where: {
          userId: voteData.userId,
          optionId: optionIds
        }
      });
    })
    .then((vote) => {
      if(vote) {
        res.status(403).json({ err: "User already voted on this poll" });
        throw new Error("voted");
      }
      return db.vote.create(voteData);
    })
    .then((vote) => {
      return vote.reload();
    }).then((vote) => {
      res.status(201).json(_.pick(vote, "userId", "optionId"));
    }).catch((err) => {
      if(!err.Error === "voted") {
        res.status(500).json({ err: "Internal Server Error" });
      }
    });
  }
}
