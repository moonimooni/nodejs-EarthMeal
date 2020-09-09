const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      // then() prints result of [arr of prods, arr of field definition]
      return res.render('shop/product-list', {
        products: rows,
        docTitle: '어스밀',
        path: '/products'
      });
    })
    .catch(error => console.log(error));
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.fetchOne(productID)
    .then(([product, fieldData]) => {
      console.log(product);
      res.render('shop/product-detail', {
        product: product[0],
        docTitle: '어스밀',
        path: ''
      });
    })
    .catch(error => console.log(error));
};

exports.getIndex = (req, res, next) => {
  return res.render('shop/index', {
    // products: products,
    docTitle: '어스밀',
    path: '/'
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchCart(cart => {
    const cartProductsInfo = [];
    Product.fetchAll()
      .then(([products, fieldData]) => {
        for (product of products) { // product is object in products arr
          const cartProductData = cart.products.find(prod => 
            prod.id === String(product.id));
          if (cartProductData) {
            cartProductsInfo.push({
              product: product,
              qty: cartProductData.qty
            });
          };
        };
        res.render('shop/cart', {
          products: cartProductsInfo,
          docTitle: '어스밀',
          path: '/cart'
        });
      })
      .catch(err => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  Product.fetchOne(productID)
    .then(([product]) => {
      Cart.addProduct(productID, product[0].price);
      console.log(product);
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.deleteCartProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.fetchOne(productID)
    .then(([product]) => {
      Cart.deleteProduct(productID, product[0].price);
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    docTitle: '어스밀',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    docTitle: '어스밀',
    path: '/checkout'
  });
};