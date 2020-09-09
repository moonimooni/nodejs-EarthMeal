const Product = require('../models/product');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-add', {
    docTitle: '어스밀',
    path: '/admin/product-add'
  });
};

exports.postAndUpdateProduct = (req, res, next) => {
  const name = req.body.name;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(name, imgUrl, price, description);

  if (req.body.id) {
    product.update(req.body.id)
      .then(res.redirect('/admin/products'))
      .catch(err => console.log(err));
  } else {
    product.post()
    .then(res.redirect('/admin/products'))
    .catch(err => console.log(err));
  };
};

exports.getProductEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  };
  const productID = req.params.id;
  Product.fetchOne(productID)
    .then(([product, fieldData]) => {
      return res.render('admin/product-edit', {
        product: product[0],
        docTitle: '어스밀',
        path: '/admin/product-add',
        editing: editMode
      });
    })
    .catch(err => console.log(err))
};

exports.deleteProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.deleteByID(productID)
    .then(res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
      return res.render('admin/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/admin/products'
      });
    })
    .catch(error => console.log(error));
};