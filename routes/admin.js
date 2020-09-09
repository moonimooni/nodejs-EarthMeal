const express = require('express');
const router = express.Router();

const { 
  getProductAdd, 
  postAndUpdateProduct, 
  getProducts, 
  getProductEdit, 
  deleteProduct } = require('../controllers/admin');


router.get('/product-add', getProductAdd);
router.get('/products', getProducts);
router.post('/product-add', postAndUpdateProduct);
router.get('/product-edit/:id', getProductEdit);
router.post('/product-edit', postAndUpdateProduct);
router.post('/product-delete/:id', deleteProduct);

module.exports = router;