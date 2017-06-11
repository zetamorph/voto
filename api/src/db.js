const Sequelize = require('sequelize');
const config = require("config");
const sequelize = new Sequelize(undefined, undefined, undefined, {
  "dialect": "sqlite",
  "storage": config.get("dbConfig.file"),
  "logging": false
});

var db = {};

// importing models

db.user = sequelize.import(__dirname + "/models/user.js");
db.poll = sequelize.import(__dirname + "/models/poll.js");
db.option = sequelize.import(__dirname + "/models/option.js");
db.vote = sequelize.import(__dirname + "/models/vote.js");
db.token = sequelize.import(__dirname + "/models/token.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 1:N association between users and polls

db.poll.belongsTo(db.user);
db.user.hasMany(db.poll);

// 1:N association between polls and options

db.poll.hasMany(db.option);
db.option.belongsTo(db.poll);

// M:N association between users and votes

db.user.hasMany(db.vote);
db.vote.belongsTo(db.user);

// 1:N association between options and votes

db.option.hasMany(db.vote);
db.vote.belongsTo(db.option);

module.exports = db;


