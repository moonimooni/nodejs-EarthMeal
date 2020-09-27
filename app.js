const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookie = require('cookie');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');
const authHandler = require('./routes/auth');

const DB_uri = ' '
const store = new MongoDBStore({
  uri: DB_uri,
  collection: 'sessions'
})
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// or app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "$@&^User's0Secret",
  resave: false,
  saveUninitialized: false,
  store: store
}));

const User = require('./models/user');

app.use((req, res, next) => {
  isLoggedIn = req.session.isLoggedIn;
  if (req.session.user) {
    User
    .findById(req.session.user)
    .then(user => req.user = user)
    .then(() => next())
    .catch(err => console.log(err));
  } else {
    return next();
  };
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authHandler);
app.use('*', errorHandler);

mongoose.set('useFindAndModify', false);
mongoose.connect(DB_uri, {
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