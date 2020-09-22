const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  return res.render('shop/index', {
    docTitle: '어스밀',
    path: '/'
  });
};

exports.getProducts = (req, res, next) => {
  return Product.fetchAll()
    .then(products => {
      return res.render('shop/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.id;
  return Product.fetchOne(productID)
    .then(product => {
      return res.render('shop/product-detail', {
        product: product,
        docTitle: `어스밀-${product.name}`,
        path: ''
      });
    })
    .catch(err => console.log(err))
};

exports.getCart = (req, res, next) => {
  return req.user
    .getCart()
    .then(products => {
      return res.render('shop/cart', {
        products: products,
        docTitle: '어스밀 - 내 장바구니',
        path: '/cart'
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  return Product.fetchOne(productID)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.deleteCartProduct = (req, res, next) => {
  const productID = req.body.productID;
  return req.user
    .deleteFromCart(productID)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  return req.user
    .getCart()
    .then(products => {
      return new Order(req.user._id, products);
    })
    .then(order => {
      return order.save(req.user._id)
    })
    .then(() => {
      return req.user.deleteCart();
    })
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  return Order
    .fetchAll(req.user._id)
    .then(orders => {
      return res.render('shop/orders', {
        orders: orders,
        docTitle: '어스밀 - 내 주문목록',
        path: '/orders'
      })
    })
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: '어스밀',
//     path: '/checkout'
//   });
// };

// {orderId: [{product1}, {product2}], orderId2: [...]}