const { orderService } = require('./order.service');

const orderController = {
  async list(req, res) {
    const orders = await orderService.listByUser(req.userId);
    res.json({ orders });
  },

  async getById(req, res) {
    const order = await orderService.getById(req.userId, req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order });
  },

  async checkout(req, res) {
    try {
      const order = await orderService.checkout(req.userId, req.body || {});
      res.status(201).json({ order });
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
