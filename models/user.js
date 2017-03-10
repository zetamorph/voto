const bcrypt = require('bcrypt'),
      _ = require('underscore'),
      jwt = require('jsonwebtoken'),
      crypto = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
  var user = sequelize.define('user', {
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

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
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
        return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
      },
      generateToken: function(type) {
        if(!_.isString(type)) {
          return undefined;
        }
        try {
          const stringData = JSON.stringify({id: this.get('id'), type: type});
          const encryptedData = crypto.AES.encrypt(stringData, "animalsnake!%").toString();
          const token = jwt.sign({
            token: encryptedData
          }, "snako%§snake");

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
      }
    }
  });
  return user;
}
