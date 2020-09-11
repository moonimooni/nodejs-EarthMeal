const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');

const { sequelize, User } = require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      //user here is not just obj. it's sequelize obj containing sequelize methods.
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use('*', errorHandler);

// 👉 sync() executes ./util/database.js 👈
// which means... it creates tables if not exists
// but option { force: true } refreshes tables whenever the server restarts.
sequelize.sync()

  // creating dummy user
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      User.create({
        name: 'AllMighty',
        email: 'allMighty@gmail.com'
      });
    }
    return user;
  })
  .then(user => {
    user
      .getCart()
      .then(cart => {
        if (cart) return '치와라'
        else return user.createCart();
      })
      .catch(err => console.log(err));
  })
  .then(result => app.listen(3000, () => {
    console.log('3000 port on');
  }))
  .catch(err => console.log(err));