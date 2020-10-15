const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-update', {
    docTitle: '어스밀',
    path: '/admin/product-add',
    errorMessage: [],
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

  console.log('작동하십니까?');
  const errors = validationResult(req);
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const img = req.body.img;
  const id = req.body.id;

  // if (!img) {
  //   errors
  //     .array()
  //     .push({param: 'img', msg: 'png, jpg, jpeg 형식만 지원합니다.'});
  // };

  const oldInput = {
    name: name,
    price: price,
    description: description,
    img: img,
    id: id
  };

  // const imgUrl = 

  if (!errors.isEmpty() && id) {
    return res
      .status(422)
      .render('admin/product-update', {
        docTitle: '어스밀',
        path: '/admin/product-add',
        errorMessage: errors.array(),
        product: oldInput,
        editing: true
      });
  } else if (!errors.isEmpty() && !id) {
    return res
      .status(422)
      .render('admin/product-update', {
        docTitle: '어스밀',
        path: '/admin/product-add',
        errorMessage: errors.array(),
        product: oldInput,
        editing: false
      });
  };

  console.log('여기까지 온 걸 보니 에러는 없습니다만...')

  Product.findById(id)
    .then(product => {
      if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.img = img;
        return product.save();
      } else {
        console.log('상품 등록중');
        return Product.create({
          name: name,
          price: price,
          description: description,
          img: img,
          userId: req.user
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
        errorMessage: []
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
  return Product.findByIdAndDelete(productID)
    .then(() => res.redirect('/admin/products'))
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};