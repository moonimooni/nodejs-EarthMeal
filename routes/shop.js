const express = require('express');
const router = express.Router();

const shopRouter = require('../controllers/shop');
const isAuth = require('../middleware/auth');

router.get('/', shopRouter.getIndex);
router.get('/products', shopRouter.getProducts);
router.get('/product-detail/:id', shopRouter.getProduct)
router.get('/cart', isAuth, shopRouter.getCart);
router.post('/cart', isAuth, shopRouter.postCart);
router.get('/orders', isAuth, shopRouter.getOrders);
// router.get('/checkout', shopRouter.getCheckout);
router.post('/cart/product-delete', isAuth, shopRouter.deleteCartProduct);
router.post('/order-create', isAuth, shopRouter.postOrder);

module.exports=router;