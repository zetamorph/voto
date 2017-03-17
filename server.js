const express = require("express"),
      morgan = require("morgan"),
      _ = require("underscore"),
      sqlite = require ("sqlite3"),
      Sequelize = require("sequelize"),
      db = require("./db.js"),
      bcrypt = require("bcrypt"),
      bodyParser = require("body-parser"),
      sass = require('node-sass'),
      middleware = require("./middleware.js")(db);

const server = express();

// Setting up express

server.set("view engine", "pug");
server.set("views", __dirname + "/views");

server.use(morgan("combined"));
server.use(bodyParser.json());
server.set('trust proxy');

// use the node-sass middleware to compile sass to css on startup




server.use(express.static(__dirname + "/public"));

// GET /

server.get("/", (req,res) => {
  res.render("index");
});

// GET /polls
// For retrieving all available polls

server.get("/polls", (req,res) => {
  if(!req.url.query) {
    db.poll.findAll().then((polls) => {
      res.status(200).json(polls).end;
    });
  }
  else{
    
  }
});

// POST /polls
// For creating a new poll

server.post("/polls", middleware.requireAuth, (req,res) => {
  const body = _.pick(req.body, "title", "description");
  
  db.poll.create(body).then((poll) => {
    req.user.addPoll(poll).then(() => {
      return poll.reload();
    }).then((poll) => {
      res.json(poll.toJSON()).end();
    });
  }, (err) => {
    res.status(400).json(err).end();
  });
});

// GET /polls/:id
// For retrieving a single poll, it`s options and votes cast for each option

server.get("/polls/:id", (req,res) => {

  const pollId = req.params.id;

  db.poll.find({
    group: ["options.id"],
    where: {
      id: pollId
    },
    attributes: ["id","title", "description", "createdAt"],
    include:
      [{model: db.option,
        attributes: [
          "id", "title", [db.sequelize.fn('COUNT', "options.votes.id"),"voteCount"]
        ],
        include: [{
          order: ["voteCount", "DESC"],
          model: db.vote,
          attributes: []
        }]
      }]
  }).then((poll) => {
    res.status(200).json(poll).end();
  }, (err) => {
    res.status(404).json(err).end();
  });
});

// PUT /polls/:id
// For changing an existing poll

server.put("/polls/:id", middleware.requireAuth, (req,res) => {

});

// DELETE /polls/:id
// For deleting an existing poll

server.delete("/polls/:id", middleware.requireAuth, (req,res) => {
  const pollId = parseInt(req.params.id, 10);
  
  db.poll.destroy({
    where : {
      id: pollId
    }
  }).then((rowsDeleted) => {
    if(rowsDeleted === 0) {
      res.status(404).json({
        error: "No poll with this ID"
      }).end();
    }
    res.status(204).end();
  }, () => {
    res.status(500).end();
  });
});

// GET /polls/:id/options
// For retrieving all available options for a specific poll and the number of votes cast for each option

server.get("/polls/:id/options", (req,res) => {
  const pollId = parseInt(req.params.id, 10);

  db.option.findAll({
    where: {
      pollId: pollId
    }
  }).then((options) => {
    res.status(200).json(options).end();
  }).catch((err) => {
    res.status(404).json(err).end();
  });
});

// POST /polls/:id/options
// For creating a new option for a poll

server.post("/polls/:id/options", middleware.requireAuth, (req,res) => {
  const body = _.pick(req.body, "title");
  const pollId = parseInt(req.params.id, 10);

  db.poll.findById(pollId).then((pollInstance) => {
    if(!pollInstance) {
      throw new Error();
    }
    req.poll = pollInstance;
    return db.option.create(body);
  }).then((option) => {
    req.poll.addOption(option).then(() => {
      return option.reload();
    }).then((option) => {
      res.json(option.toJSON()).end();
    }).catch(() => {
      res.status(500).json(err).end();
    });
  });
});

// POST /polls/:pollId/options/:OptionId/
// For voting on an option

server.post("/polls/:pollId/options/:optionId", middleware.requireAuth, (req,res) => {

  const voteData = {
    optionId: req.params.optionId,
    userId: req.user.id,
    ip: req.ip
  };

  db.vote.create(voteData).then((vote) => {
    res.json(vote.toJSON()).end;
  }, (err) => {
    res.status(400).json(err).end;
  });
});

// POST /users/signup
// For signing up a new user

server.post("/users/signup", (req,res) => {
  const body = _.pick(req.body, "email", "password");

  db.user.create(body).then((user) => {
    res.json(user.toPublicJSON()).end;
  }, (err) => {
    res.status(400).json(err).end;
  });
});

// POST /users/login
// For logging in a user

server.post("/users/login", (req,res) => {
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

server.delete("/users/login", middleware.requireAuth, (req,res) => {
  req.token.destroy().then(() => {
    res.status(204).render("index");
  }).catch(() => {
    res.status(500).end();
  });
});

// GET /users/:id/polls
// See all polls a user has created

server.get("/users/:id/polls", (req,res) => {
  db.poll.findAll({
    where: {
      userId: req.params.id
    }}).then((polls) => {
      if(polls.length) { 
        res.status(200).json(polls).end();
      }
      else {
        res.status(404).end();
      }
    }, (err) => {
      res.status(404).end();
    });
});

db.sequelize.sync({

  // uncomment to force the creation of new tables
  // force:true

  }).then(() => {
  server.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
  });
});






