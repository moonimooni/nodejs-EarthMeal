const Product = require('../models/product');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-add', {
    docTitle: '어스밀',
    path: '/admin/product-add'
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
    .catch(err => console.log(err));
};

exports.createOrUpdateProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imgUrl = req.body.imgUrl;
  const id = req.body.id;

  Product.findById(id)
    .then(product => {
      if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.imgUrl = imgUrl;
        return product.save();
      } else {
        return Product.create({
          name: name,
          price: price,
          description: description,
          imgUrl: imgUrl,
          userId: req.user
        });
      };
    })
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
  return Product.findById(productID)
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
  return Product.findByIdAndDelete(productID)
    .then(() => res.redirect('/admin/products'))
    .catch(err => console.log(err))
};