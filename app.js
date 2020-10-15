const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookie = require('cookie');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
// const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');
const authHandler = require('./routes/auth');

const DB_uri = 'mongodb+srv://moonimooni:0zLJ9jn0VG9slvCl@cluster0.9tapk.mongodb.net/shop?retryWrites=true&w=majority';

const store = new MongoDBStore({
  uri: DB_uri,
  collection: 'sessions'
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'productImages');
//   },
//   filename: (req, file, callback) => {
//     callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
//   }
// });

// const fileFilter = (req, file, callback) => {
//   if (['image/png','image/jpeg','image/jpg'].includes(file.mimetype)) {
//     callback(null, true)
//   } else callback(null, false)
// };

const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('img'))
// app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "$@&^User's0Secret",
  resave: false,
  saveUninitialized: false,
  store: store
}));

// const csrfProtection = csrf();

app.use(csrf());
app.use(flash());
app.use((req, res, next) => {
  isLoggedIn = req.session.isLoggedIn;
  csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (req.session.user) {
    User
      .findById(req.session.user)
      .then(user => {
        console.log('유저임니다.')
        console.log(user);
        if (!user) {
          console.log('유저가 없습니다');
          return next()
        };
        req.user = user;
      })
      .then(() => next())
      .catch(err => {
        console.log('에러발생');
        console.log(err);
        next(new Error(err));
      });
  } else {
    console.log('로그인 안됨');
    return next();
  };
});

app.use(authHandler);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorHandler);
app.use((error, req, res, next) => {
  console.log('지옥으로 환영해');
  return res
    .status(500)
    .render('500', {
      docTitle: 'ERROR',
      path: '',
      isLoggedIn: req.session.isLoggedIn
    });
});

mongoose.set('useFindAndModify', false);
mongoose
  .connect(DB_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    return app.listen(3000, () => {
      console.log('3000 port on');
    });
  })
  .catch(err => console.log(err))