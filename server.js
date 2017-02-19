const express = require('express');
const app = express();
const passport = require('passport');
const sqlite = require ('sqlite3');


// initialising the DB

const db = new sqlite3.Database('main.db');
var check;

// to run a query: db.run()
// create tables Users and Polls

//configuring the server

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// configuring passport.js





app.get('/', (req,res) => {
  res.render('index.pug');
});



// Defining JSON API routes

apiRoutes = express.Router();

// view a user


// show all polls

app.get('/polls', 
  (req,res) => {
    Polls.find({}, (err, data) => {
      //send polls as json
    }
  })
);

// create a new poll

app.post('/polls',
  //must be Authenticated
  (req,res) => {
    const username = req.user;
    const title = req.title;
    const options = req.options;
    Polls.insertOne({user: username, title: title, options: options}, (err) => {
      if(err) console
    });
  }
)

// delete a poll 
  // must be creator

// vote on a poll



// add a new option to a poll

// 



app.listen(8000, () => {
  console.log("Voto Server is running on port " + PORT);
});




