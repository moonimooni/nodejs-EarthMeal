module.exports = (sequelize, Sequelize) => {
  return sequelize.define('order', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  });
};