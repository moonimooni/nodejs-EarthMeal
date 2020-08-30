const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorHandler = require('./routes/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use('*', errorHandler);

app.listen(3000, () => console.log('3000 port on'));