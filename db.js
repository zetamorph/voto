const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined, undefined, undefined, {
  "dialect": "sqlite",
  "storage": __dirname + "/data/voto.sqlite"
});

var db = {};

db.user = sequelize.import(__dirname + "/models/user.js");
db.poll = sequelize.import(__dirname + "/models/poll.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.poll.belongsTo(db.user);
db.user.hasMany(db.poll);

module.exports = db;


