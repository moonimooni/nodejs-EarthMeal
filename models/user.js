const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  address: {
    variables: [{
      main: { type: Boolean, required: true },
      postcode: { type: String, required: true },
      roadAddress: { type: String, required: true },
    }]
  },
  gender: {
    type: String,
    required: false
  },
  birthDay: {
    type: String,
    required: false
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: false
      },
      qty: {
        type: Number,
        required: false
      }
    }]
  },
  orders: [{
    _id: false,
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: false
    }
  }],
  resetToken: String,
  resetTokenExp: Date
});

User.methods.addToCart = function (product) {
  const cartProducts = this.cart.items;
  const cartProductIndex = cartProducts
    .findIndex(cartProduct => {
      return cartProduct.productId.toString() === product._id.toString();
    });

  if (cartProductIndex >= 0) {
    cartProducts[cartProductIndex].qty += 1;
  } else {
    cartProducts
      .push({ productId: product._id, qty: 1 });
  };

  this.cart.items = cartProducts;
  return this.save();
};

User.methods.deleteFromCart = function (id) {
  const updatedCartProducts = this.cart.items
    .filter(i => i.productId.toString() !== id);

  this.cart.items = updatedCartProducts;
  return this.save();
};

User.methods.addOrder = function (orderIds) {
  this.orders = [];
  orderIds.forEach(id => {
    const orderId = {};
    orderId.orderId = id._id;
    this.orders.push(orderId)
  });
  return this.save();
};

User.methods.deleteCart = function () {
  this.cart = { items: [] };
  return this.save();
}

module.exports = mongoose.model('User', User);