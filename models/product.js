const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');
const Cart = require('./cart');

// return arr of product objs
const getProductsFromFile = (callback) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) return callback([])
    else return callback(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, name, imgUrl, price, description) {
    this.id = id;
    this.name = name;
    this.imgUrl = imgUrl;
    this.price = price;
    this.description = description;
  };

  static deleteByID (id) {
    getProductsFromFile((products) => {
      // arr of products except target product
      const newProducts = products.filter(product => product.id !== id);
      const product = products.find(product => product.id === id);
      fs.writeFile(p, JSON.stringify(newProducts), (error) => {
        if (error)
          console.log(error)
        else if (!error) {
          Cart.deleteProduct(id, product.price);
        };
      });
    });
  };

  static fetchAll(callback) {
    getProductsFromFile(callback);
  };

  static fetchOne(id, callback) {
    getProductsFromFile(products => {
      const product = products.find(one => one.id === id);
      callback(product);
    });
  };

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id);
        // const updatedProducts = [...products]; // optional line
        products[existingProductIndex] = this;
      } else {
        this.id = Math.ceil(Math.random() * 1000000).toString();
        products.push(this);
      }
      fs.writeFile(
        p,
        JSON.stringify(products),
        (error) => console.log(error)
      );
    });
  };
};
