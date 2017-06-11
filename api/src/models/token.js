const crypto = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('token', {
    token: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [1]
      },
      set: function (value) {
        const hashedToken = crypto.MD5(value).toString();
        this.setDataValue('token', value);
        this.setDataValue('tokenHash', hashedToken);
      }
    },
    tokenHash: DataTypes.STRING
  });
};