// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const Product = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   imgUrl: {
//     type: String,
//     required: true
//   },
//   uploaderId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// });

// module.exports = mongoose.model('Product', Product);

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
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mainImgUrl: {
      type: Sequelize.STRING,
      allowNull: false
    },
    subImgUrls: {
      type: Sequelize.STRING,
      allowNull: true
    },
    salePercent: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(13, 2),
      allowNull: false
    },
  });
};