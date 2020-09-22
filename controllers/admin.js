const Product = require('../models/product');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-add', {
    docTitle: '어스밀',
    path: '/admin/product-add'
  });
};

exports.getProducts = (req, res, next) => {
  return Product.fetchAll()
    .then(products => {
      return res.render('admin/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.createOrUpdateProduct = (req, res, next) => {
  const id = req.body.id;
  const userId = req.user._id;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const product = new Product(
    id, 
    userId, 
    name, 
    price, 
    description, 
    imgUrl
  );

  return product.save()
    .then(() => {
      return res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProductEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  };
  const productID = req.params.id;
  return Product.fetchOne(productID)
    .then(product => {
      return res.render('admin/product-edit', {
        product: product,
        docTitle: `어스밀-${product.name}`,
        path: '/admin/product-add',
        editing: editMode
      });
    })
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productID = req.params.id;
  return Product.delete(productID)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
};