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

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const Order = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   products: {
//     type: Array,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Order', Order);