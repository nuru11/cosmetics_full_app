const { DataTypes } = require('sequelize');
const defineUser = require('./user.model');
const defineAdmin = require('./admin.model');
const defineRefreshToken = require('./refresh_token.model');
const defineCategory = require('./category.model');
const defineProduct = require('./product.model');
const defineProductVariant = require('./product_variant.model');
const defineCart = require('./cart.model');
const defineCartItem = require('./cart_item.model');
const defineOrder = require('./order.model');
const defineOrderItem = require('./order_item.model');

function initModels(sequelize) {
  const User = defineUser(sequelize, DataTypes);
  const Admin = defineAdmin(sequelize, DataTypes);
  const RefreshToken = defineRefreshToken(sequelize, DataTypes);
  const Category = defineCategory(sequelize, DataTypes);
  const Product = defineProduct(sequelize, DataTypes);
  const ProductVariant = defineProductVariant(sequelize, DataTypes);
  const Cart = defineCart(sequelize, DataTypes);
  const CartItem = defineCartItem(sequelize, DataTypes);
  const Order = defineOrder(sequelize, DataTypes);
  const OrderItem = defineOrderItem(sequelize, DataTypes);

  User.hasMany(RefreshToken, { as: 'refreshTokens', foreignKey: 'userId' });
  RefreshToken.belongsTo(User, { as: 'user', foreignKey: 'userId' });

  User.hasOne(Cart, { as: 'cart', foreignKey: 'userId' });
  Cart.belongsTo(User, { as: 'user', foreignKey: 'userId' });

  Cart.hasMany(CartItem, { as: 'items', foreignKey: 'cartId' });
  CartItem.belongsTo(Cart, { as: 'cart', foreignKey: 'cartId' });

  ProductVariant.hasMany(CartItem, { as: 'cartItems', foreignKey: 'variantId' });
  CartItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

  Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });
  Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

  Product.hasMany(ProductVariant, { as: 'variants', foreignKey: 'productId' });
  ProductVariant.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

  User.hasMany(Order, { as: 'orders', foreignKey: 'userId' });
  Order.belongsTo(User, { as: 'user', foreignKey: 'userId' });

  Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
  OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'orderId' });

  Product.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'productId' });
  OrderItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });

  ProductVariant.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'variantId' });
  OrderItem.belongsTo(ProductVariant, { as: 'variant', foreignKey: 'variantId' });

  return {
    User,
    Admin,
    RefreshToken,
    Category,
    Product,
    ProductVariant,
    Cart,
    CartItem,
    Order,
    OrderItem,
  };
}

module.exports = { initModels };
