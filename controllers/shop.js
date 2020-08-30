const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    return res.render('shop/product-list', {
      products: products,
      docTitle: '어스밀',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.fetchOne(productID, product => {
    console.log(product);
    res.render('shop/product-detail', {
      product: product,
      docTitle: '어스밀',
      path: ''
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    return res.render('shop/index', {
      products: products,
      docTitle: '어스밀',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.fetchCart(cart => {
    const CartProductsInfo = [];
    Product.fetchAll(products => {
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );  // product obj in cart data
        if (cartProductData) {
          CartProductsInfo.push({
            product: product,
            qty: cartProductData.qty
          });
        };
      };
      console.log(CartProductsInfo);  // arr of productData obj
      return res.render('shop/cart', {
        products: CartProductsInfo, 
        docTitle: '어스밀',
        path: '/cart'
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  Product.fetchOne(productID, (product) => {
    Cart.addProduct(productID, product.price);
  });
  res.redirect('/cart');
};

exports.deleteCartProduct = (req, res, next) => {
  const productID = req.body.productID;
  Product.fetchOne(productID, targetProduct => {
    Cart.deleteProduct(productID, targetProduct.price);
  });
  res.redirect('/cart');
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