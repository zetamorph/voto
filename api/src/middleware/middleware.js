const crypto = require('crypto-js');

module.exports = (db) => {
  return {
    requireAuth: (req,res,next) => {
      const token = req.get('Auth') || '';

      db.token.findOne({
        where: {
          tokenHash: crypto.MD5(token).toString()
        }
      }).then((tokenInstance) => {
        if(!tokenInstance) {
          throw new Error();
        }
        req.token = tokenInstance;
        return db.user.findByToken(token);
      }).then((user) => {
        req.user = user;
        next();
      }).catch(() => {
        res.status(401).end();
      });
    },
    setHeaders: (req,res,next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Auth");
      res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
      res.header("Access-Control-Expose-Headers", "Auth");
      if (req.method === "OPTIONS") {
        res.send(200);
      }
      else {
        next();
      }
    }
  };
};
