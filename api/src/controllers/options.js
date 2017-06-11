const db = require("./../db/db");
const _ = require("lodash");

module.exports = {
  postSingleOption(req,res) {
    const pollId = parseInt(req.params.pollId, 10);
    db.poll.findById(pollId)
    .then((pollInstance) => {
      if(!pollInstance) throw new Error();
      req.poll = pollInstance;
      return db.option.create(req.body);
    })
    .then((option) => {
      req.option = option;
      return req.poll.addOption(option);
    })
    .then(() => {
      return req.option.reload();
    })
    .then((option) => {
      
      res.status(201).json(option);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
  }
}