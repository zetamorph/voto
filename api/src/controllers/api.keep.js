const express = require("express"),
      router = express.Router(),
      db = require("./../db.js"),
      _ = require('underscore'),
      middleware = require("./../middleware.js")(db);

// DELETE /polls/:id
// For deleting an existing poll

router.delete("/polls/:id", middleware.requireAuth, (req,res) => {
  const pollId = parseInt(req.params.id, 10);
  
  db.poll.destroy({
    where : {
      id: pollId
    }
  }).then((rowsDeleted) => {
    if(rowsDeleted === 0) {
      res.status(404).json({error: "No poll with this ID"}).end();
    }
    res.status(204).end();
  }, () => {
    res.status(500).end();
  });
});
