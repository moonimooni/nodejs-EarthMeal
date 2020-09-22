const mongodb = require('mongodb');
const { getDB } = require('../util/database');

class User {
  constructor(id, name, email, cart, orders) {
    this._id = id ? id : null;
    this.name = name;
    this.email = email;
    this.cart = cart;
    this.orders = orders;
  };

  save() {
    return getDB()
      .collection('users')
      .insertOne(this)
  };

  static fetchOne(id) {
    return getDB()
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(id) });
  };

  addToCart(product) {
    if (!this.cart) this.cart = { items: [] };

    const cartProducts = this.cart.items;
    const cartProductIndex = cartProducts
      .findIndex(cartProduct => {
        return cartProduct.productId.toString() === product._id.toString();
      });
    let qty = 1;

    if (cartProductIndex >= 0) {
      qty = cartProducts[cartProductIndex].qty + 1;
      cartProducts[cartProductIndex].qty = qty;
    } else {
      cartProducts.push({ productId: product._id, qty: qty });
    };

    return getDB()
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: cartProducts } } }
      )
  };

  // updateCart() {
  //   return getDB()
  //     .collection('bin')
  //     .find()
  //     .toArray()
  //     .then(oldProducts => {
  //       this.cart.items.forEach(i => {
  //         oldProducts.forEach(p => {
  //           if (i._id.toString() !== p._id.toString()) {
  //             let index = this.cart.items.indexOf(i);
  //             this.cart.items.splice(index, 1);
  //           };
  //         });
  //       });
  //       return this.cart.items
  //     })
  //     .then(products => {
  //       return getDB()
  //         .collection('users')
  //         .updateOne(
  //           { _id: this._id },
  //           { $set: { cart: { items: products } } }
  //         )
  //     });
  // };

  getCart() {
    if (!this.cart) this.cart = { items: [] };

    const productIds = [];
    const productQtys = {};

    this.cart.items.forEach(i => {
      productIds.push(i.productId);
      productQtys[i.productId] = i.qty;
    });

    return getDB().collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          return { ...p, qty: productQtys[p._id] };
        });
      })
  };

  deleteFromCart(id) {
    const updatedCartProducts = this.cart.items
      .filter(i => i.productId.toString() !== id);

    return getDB().collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartProducts } } }
      );
  };

  deleteCart() {
    return getDB()
      .collection('users')
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: [] } } }
      );
  };
};

module.exports = User;