const bcrypt = require("bcrypt");
const _ = require("underscore");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const config = require("config");
const userSecret = config.get("secrets.userSecret");
const jwtSecret = config.get("secrets.jwtSecret");

module.exports = function (sequelize, DataTypes) {
  var user = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [6, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [6,100]
      },
      set: function(value) {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(value, salt);

        this.setDataValue("password", value);
        this.setDataValue("salt", salt);
        this.setDataValue("password_hash", hashedPassword);
      }
    },
    salt: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    }
  }, {
    hooks: {
      beforeValidate: (user,options) => {
        if(typeof user.email === "string") {
          user.email = user.email.toLowerCase();
        }
      }
    },
    instanceMethods: {
      toPublicJSON: function() {
        var json = this.toJSON();
        return _.pick(json, "id", "email", "createdAt", "updatedAt");
      },
      generateToken: function(type) {
        if(!_.isString(type)) {
          return undefined;
        }
        try {
          const stringData = JSON.stringify({id: this.get("id"), type: type});
          const encryptedData = crypto.AES.encrypt(stringData, userSecret).toString();
          const token = jwt.sign({
            token: encryptedData
          }, jwtSecret);

          return token;
        } catch (err) {
          console.error(err);
          return undefined;
        }
      }
    },
    classMethods: {
      authenticate: function(body) {
        return new Promise((resolve, reject) => {
          user.findOne({
            where: {
              email: body.email
            }
          }).then((user) => {
            if(!user || !bcrypt.compareSync(body.password, user.get("password_hash"))) {
              return reject();
            }
            resolve(user);
          }, (err) => {
            reject();
          });
        });
      },
      findByToken: (token) => {
        return new Promise((resolve,reject) => {
          try {
            const decodedJWT = jwt.verify(token, jwtSecret);
            const bytes = crypto.AES.decrypt(decodedJWT.token, userSecret);
            const tokenData = JSON.parse(bytes.toString(crypto.enc.Utf8));

            user.findById(tokenData.id).then((user) => {
                if(user) { 
                  resolve(user);
                }
                else {
                  reject();
                }
              }, (err) => {
                reject();
            });
          
          } catch (err) {
            console.error(err);
            reject();
          }
        });
      }
    }
  });
  return user;
}
