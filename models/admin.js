module.exports = (sequelize, Sequelize) => {
  return sequelize.define('admin', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tel: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
};