const { validationResult } = require('express-validator');
const { Product } = require('../models/product');
const { deleteFile } = require('../util/file_controller');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-update', {
    docTitle: '어스밀',
    path: '/admin/product-add',
    errorMessage: [],
    uploadError: {},
    product: undefined,
    editing: false
  });
};

exports.getProducts = (req, res, next) => {
  return Product.find()
    .then(products => {
      return res.render('admin/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.createOrUpdateProduct = (req, res, next) => {
  const errors = validationResult(req);
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const img = req.file;
  const id = req.body.id;

  const oldInput = {
    name: name,
    price: price,
    description: description,
    id: id
  };

  let uploadError;
  let imgUrl;

  if (!img) {
    uploadError = { msg: 'png, jpeg, jpg 형식만 지원됩니다.' };
  } else {
    imgUrl = `/${img.path}`
  };

  if (!errors.isEmpty() && id) {
    return res
      .status(422)
      .render('admin/product-update', {
        docTitle: '어스밀',
        path: '/admin/product-add',
        errorMessage: errors.array(),
        uploadError: uploadError,
        product: oldInput,
        editing: true
      });
  } else if ((!errors.isEmpty() || uploadError) && !id) {
    return res
      .status(422)
      .render('admin/product-update', {
        docTitle: '어스밀',
        path: '/admin/product-add',
        errorMessage: errors.array(),
        uploadError: uploadError,
        product: oldInput,
        editing: false
      });
  };

  Product.findById(id)
    .then(product => {
      if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        if (img) {
          deleteFile(product.imgUrl)
          product.imgUrl = imgUrl;
        };
        return product.save();
      } else {
        console.log('상품 등록중');
        return Product.create({
          name: name,
          price: price,
          description: description,
          imgUrl: imgUrl,
          uploaderId: req.admin
        });
      };
    })
    .then(() => {
      console.log('끝!');
      return res.redirect('/admin/products');
    })
    .catch(err => {
      console.log('여기로 오면 안되는디?');
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  };
  const productID = req.params.id;
  return Product.findById(productID)
    .then(product => {
      return res.render('admin/product-update', {
        product: product,
        docTitle: `어스밀-${product.name}`,
        path: '/admin/product-add',
        editing: editMode,
        errorMessage: [],
        uploadError: {}
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const productID = req.params.id;
  // Product.findById(productID)
  //   .then(product => {
  //     if (!product) {
  //       const err = new Error('상품을 삭제할 수 없습니다.');
  //       return next(err);
  //     };
  //     return deleteFile(product.imgUrl);
  //   })
  //   .then(() => Product.findByIdAndDelete(productID))
  //   .then(() => res.redirect('/admin/products'))
  //   .catch(err => {
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });
  return Product
    .findByIdAndDelete(productID)
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};