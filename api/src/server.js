const bodyParser = require("body-parser");
const config = require("config");
const db = require("./db/db");
const env = process.env.NODE_ENV;
const express = require("express");

const middleware = require("./middleware/middleware")(db);
const morgan = require("morgan");
const path = require('path');
const pollRoutes = require("./routes/polls");
const optionRoutes = require("./routes/options");
const voteRoutes = require("./routes/votes");
const seed = require("./db/seed");
const Sequelize = require("sequelize");
const sqlite = require ("sqlite3");
const server = express();

let initCallback;

/* Disable logging when testing */

if(env !== "test") {
  server.use(morgan("combined"));
}

server.use(bodyParser.json());
server.use(pollRoutes, optionRoutes, voteRoutes);

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
      if(env !== "test") {
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
