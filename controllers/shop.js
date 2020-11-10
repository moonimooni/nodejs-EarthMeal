const fs = require('fs');
const path = require('path');
const PDFDoc = require('pdfkit')

const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  return res.render('shop/index', {
    docTitle: '어스밀',
    path: '/',
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
  //if just wanna use req.session.user, 
  //instaed of implementing req.user to every request,
  //use req.session.user = new User().init(req.session.user);
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  return Product.findById(productID)
    .then(product => req.user.addToCart(product))
    .then(() => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteCartProduct = (req, res, next) => {
  const productID = req.body.productID;
  return req.user
    .deleteFromCart(productID)
    .then(result => res.redirect('/cart'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//👇order controller

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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        const err = new Error('유효한 주문 내역이 없습니다.');
        return next(err);
      };
      if (order.userId.toString() !== req.user._id.toString()) {
        const err = new Error('승인되지 않은 사용자입니다.');
        return next(err);
      };
      const invoiceName = `${orderId}.pdf`;
      const invoicePath = path.join('data', 'invoices', invoiceName);
      res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //  'Content-Disposition', 
      //  'inline; filename="' + invoiceName + '"'
      // )
      const pdf = new PDFDoc();
      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);
      pdf.font('/Users/moonimooni/Library/Fonts/NanumBarunGothicBold.TTF')
      pdf.fontSize(24).text('주문 영수증');
      pdf.fontSize(22).text('------------------------------------');
      pdf.fontSize(22).text(' ');
      let totalPrice = 0;
      order.products.forEach(product => {
        totalPrice += (product.price * product.qty);
        pdf.fontSize(18).text(product.name);
        pdf.fontSize(16);
        pdf.text(`수량: ${product.qty}개`);
        pdf.text(`금액: ${product.price * product.qty}`);
        pdf.text(' ');
      });
      pdf.fontSize(22).text(`총 금액: ${totalPrice}`)
      pdf.end();
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: '어스밀',
//     path: '/checkout'
//   });
// };