require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookie = require('cookie');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');
const authRoutes = require('./routes/auth');
const sessionController = require('./controllers/session');

const { fileStorage, fileFilter } = require('./util/file_controller');

const DB_uri = process.env.MONGO_DB_URI;

const store = new MongoDBStore({
  uri: DB_uri,
  collection: 'sessions'
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('img'));
// app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(session({
  secret: "$@&^User's0Secret",
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrf());
app.use(flash());
app.use(sessionController.createSession);
app.use(sessionController.checkAdminOrUser);
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

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
  .catch(err => console.log(err));