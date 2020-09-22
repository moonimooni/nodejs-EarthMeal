const mongodb = require('mongodb');
const { getDB } = require('../util/database');
const User = require('./user');

class Product {
  constructor(id, userId, name, price, description, imgUrl) {
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imgUrl = imgUrl;
  };

  save() {
    let dbOp;
    if (this._id) {
      dbOp = getDB()
        .collection('products')
        .updateOne(
          { _id: this._id },
          { $set: this }
        )
    } else {
      dbOp = getDB()
        .collection('products')
        .insertOne(this)
    };
    return dbOp
  };

  static delete(id) {
    const objectId = new mongodb.ObjectId(id);
    return Product.fetchOne(objectId)
      .then(product => {
        return getDB()
          .collection('bin')
          .insertOne(product)
      })
      .then(() => {
        return getDB()
          .collection('products')
          .deleteOne({ _id: objectId })
      })
      .then(() => {
        return getDB()
          .collection('users')
          .updateMany(
            { 'cart.items.productId': objectId},
            { $pull: { 'cart.items': { productId: objectId } } }
          )
      });
  };

  static fetchAll() {
    return getDB()
      .collection('products')
      .find().toArray();
  };

  static fetchOne(productID) {
    return getDB()
      .collection('products')
      .find({ _id: new mongodb.ObjectID(productID) })
      .next()
  };
};

module.exports = Product;