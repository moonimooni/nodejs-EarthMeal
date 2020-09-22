const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');

const { mongoConnect } = require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/user');

app.use((req, res, next) => {
  User.fetchOne('5f66e4d09d2edf859224edc5')
    .then(user => {
      req.user = new User(
        user._id,
        user.name,
        user.email,
        user.cart,
        user.orders
      );
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('*', errorHandler);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log('3000 port on');
  });
});