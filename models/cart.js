module.exports = (sequelize, Sequelize) => {
  return sequelize.define('cart', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    }
  });
};