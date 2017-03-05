const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite = require ('sqlite3');



// initialising the DB

const db = new sqlite.Database(__dirname +'/data/voto.db');

// to run a query: db.run()
// create tables Users and Polls

//configuring the server

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting up body-parser
app.use(bodyParser.json());

// GET /

app.get('/', (req,res) => {
  res.render('index.pug');
});



// Defining JSON API routes

// view a user


// GET /polls

app.get('/polls', (req,res) => {
  db.serialize(() => {
    db.all("SELECT * FROM POLLS", (err, rows) => {
      res.end(JSON.stringify(rows));
    });
  });
});

// GET /polls/:id

app.get('/polls/:id', (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM POLLS WHERE poll_id = ?", req.params.id, (err, row) => {
      if(err) throw err;
      res.json(row);
    });
  });
});

// GET /users

app.get('/users', (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM USERS", (err, rows) => {
      res.json(rows);
    });
  });
});

// POST /polls

app.post('/polls', (req, res) => {
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

app.delete('/polls/:id', (req,res) => {
  db.serialize(() => {
    db.run("DELETE FROM POLLS WHERE poll_id = ?", req.params.id, (err) => {
      if(err) throw err;
    });
  });
});

// GET /polls/:id/votes

app.get('/polls/:id/votes', (req,res) => {
  db.serialize(() => {
    db.all("SELECT o.title, COUNT(o.title) AS votes FROM votes v JOIN options o JOIN polls p ON v.option_id = o.option_id AND o.poll_id = p.poll_id WHERE p.poll_id = ? GROUP BY o.title", req.params.id, (err, rows) => {
      res.json(rows);
    });
  });
});

// POST polls/:id/votes

app.post('/polls/:id/votes', (req,res) => {
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

app.post('/polls/:id/options', (req,res) => {
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

app.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
});




