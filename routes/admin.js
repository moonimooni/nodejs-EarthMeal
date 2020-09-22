const express = require('express');
const router = express.Router();

const adminRouter = require('../controllers/admin');

router.get('/product-add', adminRouter.getProductAdd);
router.post('/product-add', adminRouter.createOrUpdateProduct);
router.post('/product-edit', adminRouter.createOrUpdateProduct);
router.get('/products', adminRouter.getProducts);
router.get('/product-edit/:id', adminRouter.getProductEdit);
router.post('/product-delete/:id', adminRouter.deleteProduct);

module.exports = router;