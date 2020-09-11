module.exports = (sequelize, Sequelize) => {
  return sequelize.define('orderItem', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });
};