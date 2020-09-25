const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: {
    type: Array,
    required: true
  },
  // products: [
  //   {
  //     _id: false,
  //     orderedProductInfo: { type: Object, required: false, ref:'Product' }
  //   }
  // ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', Order);