const express = require('express');
const router = express.Router();

const { 
  getProductAdd, 
  postProduct, 
  getProducts, 
  getProductEdit, 
  deleteProduct } = require('../controllers/admin');


router.get('/product-add', getProductAdd);
router.get('/products', getProducts);
router.post('/product-add', postProduct);
router.get('/product-edit/:id', getProductEdit);
router.post('/product-edit', postProduct);
router.post('/product-delete/:id', deleteProduct);

module.exports = router;