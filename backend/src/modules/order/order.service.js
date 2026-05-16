const {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  sequelize,
} = require('../../lib/db');
const { loadCartWithItems } = require('../cart/cart.service');

const orderService = {
  async listByUser(userId) {
    return Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
  },

  async getById(userId, orderId) {
    return Order.findOne({
      where: { id: orderId, userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      ],
    });
  },

  async checkout(userId, { shippingAddress } = {}) {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      const err = new Error('Cart is empty');
      err.status = 400;
      throw err;
    }

    const fullCart = await loadCartWithItems(cart.id);
    const items = fullCart?.items || [];
    if (items.length === 0) {
      const err = new Error('Cart is empty');
      err.status = 400;
      throw err;
    }

    return sequelize.transaction(async (t) => {
      let totalAmount = 0;
      const lineItems = [];

      for (const item of items) {
        const product = item.product;
        if (!product || product.status !== 'ACTIVE') {
          const err = new Error(`Product unavailable: ${item.productId}`);
          err.status = 400;
          throw err;
        }

        const locked = await Product.findOne({
          where: { id: product.id },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (!locked || locked.stock < item.quantity) {
          const err = new Error(`Insufficient stock for ${product.name}`);
          err.status = 400;
          throw err;
        }

        const unitPrice = parseFloat(locked.price);
        const lineTotal = unitPrice * item.quantity;
        totalAmount += lineTotal;

        lineItems.push({
          productId: locked.id,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        });

        await locked.update(
          { stock: locked.stock - item.quantity },
          { transaction: t }
        );
      }

      const order = await Order.create(
        {
          userId,
          status: 'PENDING',
          totalAmount,
          shippingAddress: shippingAddress || null,
        },
        { transaction: t }
      );

      for (const line of lineItems) {
        await OrderItem.create(
          {
            orderId: order.id,
            ...line,
          },
          { transaction: t }
        );
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      return Order.findOne({
        where: { id: order.id },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{ model: Product, as: 'product' }],
          },
        ],
        transaction: t,
      });
    });
  },
};

module.exports = { orderService };
