_ = require("lodash");
const db = require("./../db/db");

module.exports = {

  signUp(req,res) {
    const body = _.pick(req.body, "username", "email", "password");

    db.user.create(body)
    .then((user) => {
      res.status(201).json(user.toPublicJSON()).end;
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err).end;
    });
  },

  signIn(req,res) {
    const body = _.pick(req.body, "email", "password");
    let userInstance = {};

    db.user.authenticate(body)
    .then((user) => {
      const token = user.generateToken("authentication");
      userInstance = user;
      return db.token.create({
        token: token
      });
    })
    .then((tokenInstance) => {
      res.header("Auth", tokenInstance.get("token")).json(userInstance.toPublicJSON());
    })
    .catch((err) => {
      res.status(401).end(err.toString());
    });
  },

  logOut(req,res) {
    req.token.destroy()
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).end();
    });
  },

  deleteUser(req,res) {
    req.user.destroy()
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).end();
    });
  }
}
   