module.exports = function (sequelize, DataTypes) {
  return sequelize.define('option', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        len: [1, 30]
      }
    }
  });
}