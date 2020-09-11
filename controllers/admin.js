const { Product } = require('../util/database');

exports.getProductAdd = (req, res, next) => {
  return res.render('admin/product-add', {
    docTitle: '어스밀',
    path: '/admin/product-add'
  });
};

exports.postAndUpdateProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const imgUrl = req.body.imgUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user.id

  Product.findByPk(id)
    .then(product => {
      if (product) {
        product.name = name;
        product.imgUrl = imgUrl;
        product.price = price;
        product.description = description;
        product.userId = userId;
        return product.save();
      } else {
        return req.user.createProduct({
          name: name,
          imgUrl: imgUrl,
          price: price,
          description: description,
        });
      };
    })
    .then(result => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.getProductEdit = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  };
  const productID = req.params.id;

  //getProducts() method prints arr of products.
  req.user.getProducts({ where: { id: productID } })
    .then(products => {
      return res.render('admin/product-edit', {
        product: products[0],
        docTitle: '어스밀',
        path: '/admin/product-add',
        editing: editMode
      });
    })
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const productID = req.params.id;
  Product.destroy({ where: { id: productID } })
    .then(result => {
      console.log('destroyed');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProductsList = (req, res, next) => {
  req.user.getProducts()
    .then(products => {
      return res.render('admin/product-list', {
        products: products,
        docTitle: '어스밀',
        path: '/admin/products'
      });
    })
    .catch(error => console.log(error));
};