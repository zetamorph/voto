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

// if this is set, the ip property of a request is the left-most entry in the X-Forwarded-For header, 
// so it is necessary for getting a user`s ip when the server is running behind a reverse proxy

server.set('trust proxy');

server.use(express.static(__dirname + "/public"));

// set up api routes

var apiRoutes = express.Router();
server.use("/api", apiRoutes);

// GET /
// This will render index.pug where VueJS is mounted in #app

server.get("/", (req,res) => {
  res.render("index");
});

// GET /polls
// For retrieving all available polls


apiRoutes.get("/polls", (req,res) => {
  if(req.query.user) {
    const userId = req.query.user;
    db.poll.findAll({where: {userId : userId},include: {model: db.user, attributes: ["username"]}}).then((polls) => {
      res.status(200).json(polls).end;
    });
  } else if(req.query.sort) {
    if(req.query.sort === "latest") {
      db.poll.findAll({order: [['createdAt', 'DESC']], include: {model: db.user, attributes: ["username"]}}).then((polls) => {
        res.status(200).json(polls).end;
      });
    } else if(req.query.sort === "popular") {
      
    }
  }
  else {
    db.poll.findAll({include: {model: db.user, attributes: ["username"]}}).then((polls) => {
      res.status(200).json(polls).end;
    });
  }
});

// POST /polls
// For creating a new poll

apiRoutes.post("/polls", middleware.requireAuth, (req,res) => {
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

apiRoutes.get("/polls/:id", (req,res) => {

  const pollId = req.params.id;

  db.poll.findOne({
    where: {
      id: pollId
    },include: {
      model:db.user, attributes: ["username", "id"]
    }}).then((poll) => {
    res.status(200).json(poll).end();
  }, (err) => {
    res.status(404).json(err).end();
  });
});

// PUT /polls/:id
// For changing an existing poll

apiRoutes.put("/polls/:id", middleware.requireAuth, (req,res) => {

});

// DELETE /polls/:id
// For deleting an existing poll

apiRoutes.delete("/polls/:id", middleware.requireAuth, (req,res) => {
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

apiRoutes.get("/polls/:id/options", (req,res) => {
  const pollId = parseInt(req.params.id, 10);

  db.sequelize.query(
    "SELECT options.id, options.title, COUNT (votes.optionId) AS voteCount " +
    "FROM options LEFT OUTER JOIN polls ON options.pollId = polls.id " +
    "LEFT OUTER JOIN votes ON options.id = votes.optionId " +
    "WHERE options.pollId = " + pollId + " GROUP BY options.id"
    ).then((options) => {
    res.status(200).json(options[0]).end();
  }).catch((err) => {
    res.status(404).json(err).end();
  });
});

// POST /polls/:id/options
// For creating one or more new options for a poll

apiRoutes.post("/polls/:id/options", middleware.requireAuth, (req,res) => {
  
  var body = _.pick(req.body, "title");
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

// POST /polls/:pollId/votes
// For voting on an option

apiRoutes.post("/polls/:pollId/votes/:optionId", middleware.requireAuth, (req,res) => {

  const voteData = {
    optionId: req.params.optionId,
    userId: req.user.id,
  };

  db.vote.create(voteData).then((vote) => {
    return vote.reload();
  }).then((vote) => {
    res.json(vote.toJSON()).end;
  }, (err) => {
    res.status(400).json(err).end;
  });
});

// POST /users/signup
// For signing up a new user

server.post("/users/signup", (req,res) => {
  const body = _.pick(req.body, "username", "email", "password");

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

// GET /polls/:pollId/votes/users/:userId
// Retrieve information about whether a user already voted for the specified poll

apiRoutes.get("/polls/:pollId/votes/users/:userId", middleware.requireAuth, (req,res) => {
  const pollId = req.params.pollId;
  const userId = req.params.userId;

  db.sequelize.query(
    "SELECT " + 
      "CASE " +
		    "WHEN users.id IS NULL THEN 'false' " +
		    "ELSE 'true' " +
	    "END AS hasVoted " +
    "FROM polls " +
    "LEFT JOIN options ON options.pollId = polls.id " + 
    "LEFT OUTER JOIN votes ON options.id = votes.optionId " +
    "LEFT JOIN users ON users.id = votes.userId" +
    " WHERE polls.id = " + pollId + " AND users.id=" + userId + " GROUP BY polls.id"
  ).then((result) => {
    res.status(200).json(result[0][0]).end();
  });
});

db.sequelize.sync({

  // uncomment to force the creation of new tables
  //force:true

}).then(() => {

  // uncomment to seed the database with the data in the required file
  // require("./data/seed.js")(db);

  server.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
  });
});






