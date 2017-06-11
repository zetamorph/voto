const bodyParser = require("body-parser");
const config = require("config");
const db = require("./db");
const express = require("express");

const middleware = require("./middleware/middleware")(db);
const morgan = require("morgan");
const path = require('path');
const pollRoutes = require("./routes/polls");
const seed = require("./db/seed.js");
const Sequelize = require("sequelize");
const sqlite = require ("sqlite3");
const server = express();

let initCallback;

/* Disable logging when testing */

if(process.env.NODE_ENV != "test") {
  server.use(morgan("combined"));
}


server.use(bodyParser.json());
server.use(pollRoutes);

// if this is set, the ip property of a request is the left-most entry in the X-Forwarded-For header, 
// so setting this is necessary for getting a user`s ip when the server is running behind a reverse proxy

server.set('trust proxy');

db.sequelize.sync({
  force: config.get("dbConfig.force")
})
.then(() => {
  seed(db, () => {
    server.listen(8000, () => {
      if(initCallback)  {
        initCallback();
      }
      if(process.env.NODE_ENV =! "test") {
        console.log("Voto API is running on port 8000");
      }
    });
  });
})
.catch((err) => {
  if(err) throw err;
});

module.exports = {
  server: server,
  init (cb) {
    initCallback = cb;
  }
}





