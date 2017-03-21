#!/usr/bin/env node

const express = require("express"),
      morgan = require("morgan"),
      _ = require("underscore"),
      sqlite = require ("sqlite3"),
      Sequelize = require("sequelize"),
      db = require("./db.js"),
      bcrypt = require("bcrypt"),
      bodyParser = require("body-parser"),
      middleware = require("./middleware.js")(db),
      router = require("./controllers/index.js"),
      server = express();

// Setting up express

server.set("view engine", "pug");
server.set("views", "./views");
server.use(express.static("./public"));
server.use(morgan("combined"));
server.use(bodyParser.json());
server.use(require("./controllers"));

// if this is set, the ip property of a request is the left-most entry in the X-Forwarded-For header, 
// so setting this is necessary for getting a user`s ip when the server is running behind a reverse proxy

server.set('trust proxy');

db.sequelize.sync({

  // uncomment to force the creation of new tables
  // force:true

}).then(() => {

  // uncomment to seed the database with the data in the required file
  // require("./data/seed.js")(db);

  server.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
  });
});






