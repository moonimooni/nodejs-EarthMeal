const db = require('../util/database');
const Cart = require('./cart');

module.exports = class Product {
  constructor(name, imgUrl, price, description) {
    this.name = name;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
  };

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  };

  static fetchOne(id) {
    return db.execute('SELECT * FROM products where id=?', [id]);
  };

  static deleteByID (id) {
    return db.execute(`DELETE FROM products where id=?`, [id]);
  };

  post() {
    return db.execute(
      `INSERT INTO products (name, imgUrl, price, description)
       VALUE (?, ?, ?, ?)`,
      [this.name, this.imgUrl, this.price, this.description]
    );
  };

  update(id) {
    return db.execute(
      `UPDATE products SET name=?, imgUrl=?, price=?, description=? WHERE id=?`,
      [this.name, this.imgUrl, this.price, this.description, id]
    );
  };
};
