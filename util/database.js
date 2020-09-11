const Sequelize = require('sequelize');

//creating instance
const sequelize = new Sequelize(
  'node-earthMeal', 
  'root', 
  '1111', 
  {dialect: 'mysql', host: 'localhost'}
);

const db = {};

db.Sequelize = Sequelize; // 패키지
db.sequelize = sequelize; // 인스턴스

db.Product = require('../models/product')(sequelize, Sequelize);
db.User = require('../models/user')(sequelize, Sequelize);
db.Cart = require('../models/cart')(sequelize, Sequelize);
db.CartItem = require('../models/cart-item')(sequelize, Sequelize);
db.Order = require('../models/order')(sequelize, Sequelize);
db.OrderItem = require('../models/order-item')(sequelize, Sequelize);

db.Product.belongsTo(db.User, { constraints: true, onDelete: 'CASCADE' });
db.User.hasMany(db.Product);
db.User.hasOne(db.Cart);
db.Cart.belongsTo(db.User);
// 👇 a single cart contains multiple products,  
db.Cart.belongsToMany(db.Product, { through: db.CartItem });
// 👇 a single product can be contained in multiple carts.
db.Product.belongsToMany(db.Cart, { through: db.CartItem });
db.Order.belongsTo(db.User);
db.User.hasMany(db.Order);
db.Order.belongsToMany(db.Product, { through: db.OrderItem });
db.Product.belongsToMany(db.Order, { through: db.OrderItem });

//exporting instance
module.exports = db;