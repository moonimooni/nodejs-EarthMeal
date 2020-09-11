const express = require('express');
const router = express.Router();

const shopRouter = require('../controllers/shop');

router.get('/', shopRouter.getIndex);
router.get('/products', shopRouter.getProducts);
router.get('/product-detail/:id', shopRouter.getProduct)
router.get('/cart', shopRouter.getCart);
router.post('/cart', shopRouter.postCart);
router.get('/orders', shopRouter.getOrders);
// router.get('/checkout', shopRouter.getCheckout);
router.post('/cart/product-delete', shopRouter.deleteCartProduct);
router.post('/order-create', shopRouter.postOrder);

module.exports=router;