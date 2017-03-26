#!/usr/bin/env node

const express = require("express"),
      path = require('path'),
      cors = require('cors'),
      fs = require('fs'),
      https = require('https'),
      morgan = require("morgan"),
      config = require("config"),
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
server.set("views", path.join(__dirname, "./views"));
server.use(express.static(path.join(__dirname, "/public")));
server.use(morgan("combined"));
server.use(bodyParser.json());
server.use(require("./controllers"));
server.use(cors());
server.options("*", cors());

// if this is set, the ip property of a request is the left-most entry in the X-Forwarded-For header, 
// so setting this is necessary for getting a user`s ip when the server is running behind a reverse proxy

server.set('trust proxy');

db.sequelize.sync({
  // force: true
}).then(() => {
  // uncomment to seed the database with the data in the required file
  // require("./data/seed.js")(db);
  server.listen(8000, () => {
  console.log("Voto Server is running on port 8000");
  });
});

module.exports = server;





