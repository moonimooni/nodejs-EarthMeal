const express = require('express');
const router = express.Router();

const { 
  getProducts, 
  getProduct, 
  getIndex, 
  getCart, 
  getCheckout, 
  getOrders, 
  postCart,
  deleteCartProduct
} = require('../controllers/shop');

router.get('/', getIndex);
router.get('/products', getProducts);
router.get('/product-detail/:id', getProduct)
router.get('/cart', getCart);
router.post('/cart', postCart);
router.get('/orders', getOrders);
router.get('/checkout', getCheckout);
router.post('/cart/product-delete', deleteCartProduct);

module.exports=router;