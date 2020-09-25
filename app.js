const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/user');

app.use((req, res, next) => {
  User.findById("5f6ce8300c9c9c356326327e")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use('*', errorHandler);

const url = ' '

mongoose.set('useFindAndModify', false);
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    const user = {
      name: 'Moon',
      email: 'moon@test.com',
      // cart: {
      //   items: []
      // }
    };
    return User
      .findOneAndUpdate(
        { name: 'Moon' }, 
        user, 
        { upsert: true }
      );
  })
  .then(() => {
    return app.listen(3000, () => {
      console.log('3000 port on');
    });
  })
  .catch(err => console.log(err))