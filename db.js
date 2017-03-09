const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined, undefined, undefined, {
  "dialect": "sqlite",
  "storage": __dirname + "/data/voto.sqlite"
});

var db = {};

// importing models

db.user = sequelize.import(__dirname + "/models/user.js");
db.poll = sequelize.import(__dirname + "/models/poll.js");
db.option = sequelize.import(__dirname + "/models/option.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 1:N association between users and polls

db.poll.belongsTo(db.user);
db.user.hasMany(db.poll);

// 1:N association between polls and options

db.poll.hasMany(db.option);
db.option.belongsTo(db.poll);

// M:N association between users and options

db.user.belongsToMany(db.option, {through: 'votes'});
db.option.belongsToMany(db.user, {through: 'votes'});

module.exports = db;


