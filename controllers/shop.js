const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  return res.render('shop/index', {
    docTitle: '어스밀',
    path: '/'
  });
};

exports.getProducts = (req, res, next) => {
  return Product
    .find()
    // .select('name price imgUrl -_id')
    // or
    // .populate('userId', 'name')
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
  return Product
    .findById(productID)
    .then(product => {
      return res.render('shop/product-detail', {
        product: product,
        docTitle: `어스밀 - ${product.name}`,
        path: ''
      });
    })
    .catch(err => console.log(err))
};

exports.getCart = (req, res, next) => {
  return req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      let products;
      if (!user.cart.items) products = [];
      else products = user.cart.items;
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
  return Product.findById(productID)
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
  const userId = req.user._id;
  return req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const orderedProducts = user.cart.items
        .map(i => {
          return { ...i.productId._doc, qty: i.qty }
        });
      const newOrder = new Order({
        userId: userId,
        products: orderedProducts
      });
      return newOrder.save();
    })
    .then(() => {
      return Order
        .find({ userId: userId })
        .select('_id')
    })
    .then(orders => {
      return req.user.addOrder(orders)
    })
    .then(() => req.user.deleteCart())
    .then(() => res.redirect('/orders'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  const userId = req.user._id;
  return Order
    .find({ userId: userId })
    .select('products')
    .then(orders => {
      return res.render('shop/orders', {
        orders: orders,
        docTitle: '어스밀 - 내 주문목록',
        path: '/orders'
      });
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: '어스밀',
//     path: '/checkout'
//   });
// };