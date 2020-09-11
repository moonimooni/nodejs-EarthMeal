const { Product } = require('../util/database');

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      return res.render('shop/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/products'
      });
    })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.findByPk(productID)
    .then(product => {
      return res.render('shop/product-detail', {
        product: product,
        docTitle: '어스밀',
        path: ''
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  return res.render('shop/index', {
    docTitle: '어스밀',
    path: '/'
  });
};

exports.getCart = (req, res, next) => {
  // req.user.cart doesn't work but codes below work.
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
    })
    .then(products => {
      //products here is arr.
      return res.render('shop/cart', {
        products: products,
        docTitle: '어스밀',
        path: '/cart'
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productID = req.body.productID;
  let fetchedCart;
  let quantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productID } });
      // this only prints one type of product. (but in array)
    })
    .then(cartProductArr => {
      if (cartProductArr.length > 0) {
        const cartProduct = cartProductArr[0];
        quantity += cartProduct.cartItem.quantity;
        return cartProduct;
      } else {
        return Product.findByPk(productID)
      };
    })
    .then(product => {
      //product here is obj.
      fetchedCart
        .addProduct(product, {
          through: { quantity: quantity }
        })
      return res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.deleteCartProduct = (req, res, next) => {
  const productID = req.body.productID;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productID } });
    })
    .then(productArr => {
      const product = productArr[0];
      product.cartItem.destroy();
    })
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let cartProductsArr;
  let fetchedCart;
  const user = req.user;
  user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      cartProductsArr = products;
      return user.createOrder();
    })
    .then(order => {
      order.addProducts(cartProductsArr.map(product => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      }));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => res.redirect('/orders'))
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  const user = req.user;
  user
    .getOrders({ include: Product })
    // 👆 can fetch products of orders and orderItems like this.
    .then(orders => {
      return res.render('shop/orders', {
        orders: orders,
        docTitle: '어스밀',
        path: '/orders'
      });
    })
    .catch(err => console.log(err));
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     docTitle: '어스밀',
//     path: '/checkout'
//   });
// };