const { Op } = require('sequelize');
const {
  Cart,
  CartItem,
  Order,
  OrderItem,
  Product,
  sequelize,
} = require('../../lib/db');
const { loadCartWithItems } = require('../cart/cart.service');
const { validateContact, validateItems } = require('./order.validation');
const { validateOrderStatus } = require('./order.status');

const orderIncludes = [
  {
    model: OrderItem,
    as: 'items',
    include: [{ model: Product, as: 'product' }],
  },
];

function buildShippingAddress({ customerName, phone, city }) {
  return { name: customerName, phone, city };
}

function accessWhere(clientDeviceId, userId) {
  const clauses = [{ clientDeviceId }];
  if (userId) {
    clauses.push({ userId });
  }
  return { [Op.or]: clauses };
}

const orderService = {
  async listForClient(clientDeviceId, userId) {
    const rows = await Order.findAll({
      where: accessWhere(clientDeviceId, userId),
      include: orderIncludes,
      order: [['createdAt', 'DESC']],
    });

    const seen = new Set();
    const orders = [];
    for (const row of rows) {
      const id = row.id;
      if (seen.has(id)) continue;
      seen.add(id);
      orders.push(row);
    }
    return orders;
  },

  async getByIdForClient(clientDeviceId, userId, orderId) {
    return Order.findOne({
      where: {
        id: orderId,
        ...accessWhere(clientDeviceId, userId),
      },
      include: orderIncludes,
    });
  },

  async checkoutFromItems(clientDeviceId, userId, body = {}) {
    const contact = validateContact(body);
    const items = validateItems(body.items);

    return sequelize.transaction(async (t) => {
      let totalAmount = 0;
      const lineItems = [];

      for (const item of items) {
        const locked = await Product.findOne({
          where: { id: item.productId },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (!locked || locked.status !== 'ACTIVE') {
          const err = new Error(`Product unavailable: ${item.productId}`);
          err.status = 400;
          throw err;
        }

        if (locked.stock < item.quantity) {
          const err = new Error(`Insufficient stock for ${locked.name}`);
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
          userId: userId || null,
          clientDeviceId,
          status: 'PENDING',
          totalAmount,
          customerName: contact.customerName,
          phone: contact.phone,
          city: contact.city,
          shippingAddress: buildShippingAddress(contact),
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

      return Order.findOne({
        where: { id: order.id },
        include: orderIncludes,
        transaction: t,
      });
    });
  },

  async listAllAdmin({ limit = 50, offset = 0, status } = {}) {
    const where = {};
    if (status) {
      where.status = validateOrderStatus(status);
    }

    return Order.findAndCountAll({
      where,
      include: orderIncludes,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });
  },

  async getByIdAdmin(orderId) {
    return Order.findOne({
      where: { id: orderId },
      include: orderIncludes,
    });
  },

  async updateStatusAdmin(orderId, status) {
    const nextStatus = validateOrderStatus(status);
    const order = await Order.findOne({ where: { id: orderId } });
    if (!order) return null;

    await order.update({ status: nextStatus });
    return Order.findOne({
      where: { id: orderId },
      include: orderIncludes,
    });
  },

  /** Legacy: checkout from server cart for authenticated users. */
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
      include: orderIncludes,
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

    const snapshot = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const contact = shippingAddress || {};
    const order = await orderService.checkoutFromItems(
      `user-cart-${userId}`,
      userId,
      {
        items: snapshot,
        customerName: contact.name || contact.customerName || 'Customer',
        phone: contact.phone || '0000000000',
        city: contact.city || 'N/A',
      }
    );

    await CartItem.destroy({ where: { cartId: cart.id } });
    return order;
  },
};

module.exports = { orderService, validateContact, validateItems };
