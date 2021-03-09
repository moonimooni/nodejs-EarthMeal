module.exports = (sequelize, Sequelize) => {
  return sequelize.define('user', {
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
      allowNull: false,
    },
    tel: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false
    },
    birthday: {
      type: Sequelize.STRING,
      allowNull: false
    },
    addresses: {
      type: Sequelize.TEXT,
      get: function () {
        return JSON.parse(this.getDataValue('value'));
      },
      set: function (value) {
        this.setDataValue('value', JSON.stringify(value));
      }
    }
  });
};