const Sequelize = require('sequelize');

//creating instance
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  { dialect: 'mysql', host: process.env.DB_HOST }
);

const db = {};

db.Sequelize = Sequelize; // 패키지
db.sequelize = sequelize; // 인스턴스

db.Product = require('./product')(sequelize, Sequelize);
db.Admin = require('./admin')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);
db.Cart = require('./cart')(sequelize, Sequelize);
db.CartItem = require('./cart_item')(sequelize, Sequelize);
db.Order = require('./order')(sequelize, Sequelize);
db.OrderItem = require('./order_item')(sequelize, Sequelize);

//admin and products' relation
db.Product.belongsTo(db.Admin, { constraints: true, onDelete: 'CASCADE' });
db.Admin.hasMany(db.Product);

//users relation
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