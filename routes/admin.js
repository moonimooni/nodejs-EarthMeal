const express = require('express');
const router = express.Router();

const adminRouter = require('../controllers/admin');


router.get('/product-add', adminRouter.getProductAdd);
router.get('/products', adminRouter.getProductsList);
router.post('/product-add', adminRouter.postAndUpdateProduct);
router.get('/product-edit/:id', adminRouter.getProductEdit);
router.post('/product-edit', adminRouter.postAndUpdateProduct);
router.post('/product-delete/:id', adminRouter.deleteProduct);

module.exports = router;