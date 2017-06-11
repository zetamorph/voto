module.exports = function (sequelize, DataTypes) {
  return sequelize.define("poll", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 50]
      }
    }
  });
}


