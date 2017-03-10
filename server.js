const express = require('express'),
      morgan = require('morgan'),
      _ = require('underscore'),
      sqlite = require ('sqlite3'),
      Sequelize = require('sequelize'),
      db = require('./db.js'),
      bcrypt = require('bcrypt'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      methodOverride = require('method-override'),
      session = require('express-session');
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      GoogleStrategy = require('passport-google');

const server = express();

// setting up sequelize

// Setting up express

server.set('view engine', 'pug');
server.set('views', __dirname + '/views');
server.use(express.static(__dirname + '/public'));
server.use(morgan('combined'));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(methodOverride('X-HTTP-Method-Override'));
server.use(session({secret:"VierundZwanzigMalNeun", saveUninitialized: true, resave: true}));
server.use(passport.initialize());
server.use(passport.session());

// Setting up passport 

// The whole user object can be serialized and deserialized since the user objects for Voto are quite small

passport.serializeUser((user,done) => {
  done(null,user);
});

passport.deserializeUser((user,done) => {
  done(null, obj);
});

// passport session persistence middleware

// middleware for checking if user is authenticated

//configuring the server

// GET /

server.get('/', (req,res) => {
  res.render('login.pug');
});



// Defining JSON API routes

const apiRoutes = express.Router();

// GET /polls

apiRoutes.get("/polls", (req,res) => {
  db.poll.findAll().then((polls) => {
    res.status(200).json(polls).end;
  });
});

// POST /polls

apiRoutes.post("/polls", (req,res) => {
  const body = _.pick(req.body, "title", "description");

  db.poll.create(body).then((poll) => {
    res.json(poll.toJSON()).end;
  }, (err) => {
    res.status(400).json(err).end;
  });
});

// defining auth Routes

const authRoutes = express.Router();

// POST auth/signup

authRoutes.post("/register", (req,res) => {
  const body = _.pick(req.body, "email", "password");

  db.user.create(body).then((user) => {
    res.json(user.toPublicJSON()).end;
  }, (err) => {
    res.status(400).json(err).end;
  });
});

// POST auth/login

authRoutes.post("/login", (req,res) => {
  const body = _.pick(req.body, "email", "password");

  db.user.authenticate(body).then((user) => {
    res.header("Auth", user.generateToken("authentication")).json(user.toPublicJSON()).end();
  }, (err) => {
    res.status(401).end();
  });

  //basic input validation?

  
});









// GET /polls
/*
apiRoutes.get('/polls', (req,res) => {
  db.serialize(() => {
    db.all("SELECT * FROM POLLS", (err, rows) => {
      res.end(JSON.stringify(rows));
    });
  });
});

// GET /polls/:id

apiRoutes.get('/polls/:id', (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM POLLS WHERE poll_id = ?", req.params.id, (err, row) => {
      if(err) throw err;
      res.json(row);
    });
  });
});

// GET /users

apiRoutes.get('/users', (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM USERS", (err, rows) => {
      res.json(rows);
    });
  });
});

// POST /polls

apiRoutes.post('/polls', (req, res) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const desc = req.body.description;
  db.serialize(() => {
    db.run("INSERT INTO POLLS (user_id, title, description) VALUES (?, ?, ?)", [userId, title, desc], (err) => {
      if(err) throw err;
    });
  });
});

// DELETE /polls

apiRoutes.delete('/polls/:id', (req,res) => {
  db.serialize(() => {
    db.run("DELETE FROM POLLS WHERE poll_id = ?", req.params.id, (err) => {
      if(err) throw err;
    });
  });
});

// GET /polls/:id/votes

apiRoutes.get('/polls/:id/votes', (req,res) => {
  db.serialize(() => {
    db.all("SELECT o.title, COUNT(o.title) AS votes FROM votes v JOIN options o JOIN polls p ON v.option_id = o.option_id AND o.poll_id = p.poll_id WHERE p.poll_id = ? GROUP BY o.title", req.params.id, (err, rows) => {
      res.json(rows);
    });
  });
});

// POST polls/:id/votes

apiRoutes.post('/polls/:id/votes', (req,res) => {
  const userId = req.body.userId;
  const optionId = req.body.optionId;
  const pollId = req.params.id;
  db.serialize(() => {
    db.run("INSERT INTO votes (option_id, user_id) VALUES (? , ?)", [optionId, userId], (err) => {
      if(err) throw err;
      res.redirect('/polls/'+pollId); 
    });
  });
});

// POST /polls/:id/options

apiRoutes.post('/polls/:id/options', (req,res) => {
  const pollId = req.params.id;
  const userId = req.body.userId;
  const title = req.body.title;
  db.serialize(() => {
    db.run("INSERT INTO options (poll_id, title) VALUES (?, ?)", [pollId, title], (err) => {
      if(err) throw err;
      const optionId = this.lastID;
      db.run("INSERT INTO votes (option_id, user_id) VALUES (?, ?)", [optionId, userId], (err) => {
        if(err) throw err;
        res.redirect("/polls/"+pollId);
      });
    });
  });
});
*/
server.use("/api", apiRoutes);
server.use("/auth", authRoutes);

// force:true forces the creation of a new DB, turn off for production

db.sequelize.sync().then(() => {
  server.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
  });
});






