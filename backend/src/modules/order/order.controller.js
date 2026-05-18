const { orderService } = require('./order.service');

function formatOrder(order) {
  if (!order) return null;
  const json = order.toJSON ? order.toJSON() : order;
  return json;
}

const orderController = {
  async list(req, res) {
    const orders = await orderService.listForClient(
      req.clientDeviceId,
      req.userId || null
    );
    res.json({ orders: orders.map(formatOrder) });
  },

  async getById(req, res) {
    const order = await orderService.getByIdForClient(
      req.clientDeviceId,
      req.userId || null,
      req.params.id
    );
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order: formatOrder(order) });
  },

  async checkout(req, res) {
    try {
      const order = await orderService.checkoutFromItems(
        req.clientDeviceId,
        req.userId || null,
        req.body || {}
      );
      res.status(201).json({ order: formatOrder(order) });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },
};

module.exports = { orderController };
