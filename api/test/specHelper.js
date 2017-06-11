const db = require("./../src/db/db");
const server = require("./../src/server");

var user = {};
var token = "";

before("make sure the db is seeded with test data and the server is listening", (done) => {
  server.init(() => {
    //generate an Authentication token to post polls with
    db.user.authenticate({
      email: "markus@markus.de",
      password: "markus"
    })
    .then((userInstance) => {
      module.exports.user = userInstance;
      return db.token.create({
        token: userInstance.generateToken("authentication")
      });
    })
    .then((tokenInstance) => {
      module.exports.token = tokenInstance.get("token");
      done();
    })
    .catch((err) => {
      if(err) throw err;
    });
  });
});

module.exports = {
  user: user,
  token: token
}