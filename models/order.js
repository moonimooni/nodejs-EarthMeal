const mongodb = require('mongodb');
const { getDB } = require('../util/database');
const User = require('./user');

class Order {
  constructor(userId, products) {
    this._id = new mongodb.ObjectId();
    this.userId = userId;
    this.products = products;
  };
  
  save(userId) {
    return User.fetchOne(userId)
      .then(user => {
        if (user.orders) return user.orders
        else return [];
      })
      .then(orders => {
        const ordersInfo = [...orders];
        ordersInfo.push(this._id);
        return ordersInfo;
      })
      .then(orders => {
        return getDB()
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectId(userId) },
            { $set: { orders: orders } }
          );
      })
      .then(result => {
        return getDB()
          .collection('orders')
          .insertOne(this);
      });
  };

  static fetchAll(userId) {
    return getDB()
      .collection('orders')
      .find({ userId: new mongodb.ObjectId(userId) })
      .toArray()
  };
};

module.exports = Order;