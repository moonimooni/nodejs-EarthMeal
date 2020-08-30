const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'products.json');
const Product = require('../models/product');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-add', {
    docTitle: '어스밀',
    path: '/admin/product-add'
  });
};

exports.postProduct = (req, res, next) => {
  const name = req.body.name;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  let id;
  let product;
  if (req.body.id) {
    id = req.body.id;
    product = new Product(id, name, imgUrl, price, description);
  } else {
    product = new Product(null, name, imgUrl, price, description);
  }
  product.save();
  return res.redirect('/admin/products');
};

// exports.getProductEdit = (req, res, next) => {
//   const ProductID = req.params.id;
//   Product.fetchOne((ProductID), product => {
//     return res.render('admin/product-edit', {
//       product: product,
//       docTitle: '어스밀',
//       path: '/admin/product-add'
//     });
//   });
// };

exports.getProductEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const ProductID = req.params.id;
  Product.fetchOne((ProductID), (product => {
    return res.render('admin/product-edit', {
      product: product,
      docTitle: '어스밀',
      path: '/admin/product-add',
      editing: editMode
    });
  }));
};

exports.deleteProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.deleteByID(productID);
  return res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    return res.render('admin/product-list', {
      products: products,
      docTitle: '어스밀',
      path: '/admin/products'
    });
  });
};

// exports.postProductDelete = (req, res, next) => {
//   const productID = req.params.id;
//   Product.fetchAll(products => {
//     const selectedProductIndex = products.findIndex(prod => prod.id === productID);
//     products.splice(selectedProductIndex, 1);
//     fs.writeFile(
//       p,
//       JSON.stringify(products),
//       (error) => console.log(error)
//     );
//     return res.redirect('/admin/products');
//   });
// };

