const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'cart.json');

const getCartFromFile = (callback) => {
  fs.readFile(p, (error, fileContent) => {
    if (error) return callback([])
    else return callback(JSON.parse(fileContent));
  });
};

module.exports = class Cart {

  static fetchCart(callback) {
    getCartFromFile(callback);
  };

  static addProduct(id, productPrice) {

    // fetch previous cart
    fs.readFile(p, (error, fileContent) => {
      let cart;
      if (error)
        cart = { products: [], totalPrice: 0 };
      else
        cart = JSON.parse(fileContent); // obj

      // analyze products in cart and check its qty, price
      const existingProductIndex = cart.products.findIndex(product => product.id === id);
      const existingProduct = cart.products[existingProductIndex]; // obj
      let updatedProduct;
      if (!existingProduct) {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      } else {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        // cart.products = [...cart.products]; // optional line
        cart.products[existingProductIndex] = updatedProduct;
      };
      cart.totalPrice = cart.totalPrice + +productPrice;

      //save changing
      fs.writeFile(p, JSON.stringify(cart), error => console.log(error));
    });
  };

  static deleteProduct(id, productPrice) {
    getCartFromFile(cartData => {
      const product = cartData.products.find(product => product.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      cartData.totalPrice = cartData.totalPrice - (productPrice * productQty);
      cartData.products = cartData.products.filter(product => product.id !== id);
      fs.writeFile(p, JSON.stringify(cartData), error => console.log(error));
    });
      // const updatedCart = { ...cart }; // optional
  };

  // static deleteProduct(id, productPrice) {
  //   fs.readFile(p, (error, fileContent) => {
  //     if (error) return;
  //     const cart = JSON.parse(fileContent);
  //     // const updatedCart = { ...cart }; // optional
  //     const product = cart.products.find(product => product.id === id);
  //     const productQty = product.qty;
  //     cart.totalPrice = cart.totalPrice - (productPrice * productQty);
  //     cart.products = cart.products.filter(product => product.id !== id);
  //     fs.writeFile(p, JSON.stringify(cart), error => console.log(error));
  //   });
  // };
};