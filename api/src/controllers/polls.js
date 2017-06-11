const db = require("./../db");

module.exports = {
  getPolls(req,res) {
    if(req.query.user) {
      const userId = req.query.user;
      Poll.findAll({where: {userId : userId},include: {model: User, attributes: ["username"]}}).then((polls) => {
        res.status(200).json(polls).end;
      }).catch((err) => {
        res.status(404).json(err).end();
      });
    } else if(req.query.sort) {
      if(req.query.sort === "latest") {
        Poll.findAll({order: [['createdAt', 'DESC']], include: {model: User, attributes: ["username"]}}).then((polls) => {
          res.status(200).json(polls).end;
        }).catch((err) => {
          res.status(404).json(err);
        });
      } else if(req.query.sort === "popular") {
        db.sequelize.query(
          "SELECT options.id, options.title, COUNT (votes.optionId) AS voteCount " +
          "FROM options LEFT OUTER JOIN polls ON options.pollId = polls.id " +
          "LEFT OUTER JOIN votes ON options.id = 1 " +
          "WHERE options.pollId = " + pollId + " GROUP BY options.id ORDER BY voteCount"
          ).then((options) => {
          res.status(200).json(options[0]).end();
        }).catch((err) => {
          res.status(404).json(err).end();
        });
      }
    }
    else {
      db.poll.findAll({ 
        include: { model: db.user, attributes: ["username"] }
      })
      .then((polls) => {
        res.status(200).json(polls).end;
      }).catch((err) => {
        res.status(404).json(err).end();
      });
    }
  },

  getSinglePoll(req,res){

    const pollId = parseInt(req.params.pollId, 10);
    let resObj;

    db.poll.findOne({
      where: { id: pollId },
      attributes: ["id", "title"],
      include: {
        model: db.user,
        attributes: ["id", "username"]
      }
    }).then((result) => {
      resObj = result.dataValues;
      resObj.user = result.dataValues.user.dataValues;
      return db.sequelize.query(
        "SELECT options.id AS optionId, options.title AS title,  " +
        "COUNT (votes.optionId) AS votes FROM options " +
        "LEFT JOIN votes ON options.id = votes.optionId " +
        "WHERE options.pollId = " + pollId + " GROUP BY options.id"
      )
    })
    .then((results) => {
      resObj.options = [];
      resObj.votes = [];
      results[0].forEach((el, index, arr) => {
        resObj.options[index] = el.title;
        resObj.votes[index] = el.votes;
      });
      res.status(200).json(resObj);
    })
    .catch((err) => {
      res.status(404).json(err);
    });

  }

}
