module.exports = function (sequelize, DataTypes) {
  return sequelize.define('vote', {
    ip: {
      type: DataTypes.STRING,
    }
  });
}