module.exports = (sequelize, Sequelize) => {
  return sequelize.define('product', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    imgUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(13, 2),
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
};