const { orderService } = require('./order.service');

function formatOrder(order) {
  if (!order) return null;
  return order.toJSON ? order.toJSON() : order;
}

const adminOrderController = {
  async list(req, res) {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const status = req.query.status ? String(req.query.status).trim() : undefined;

    const result = await orderService.listAllAdmin({ limit, offset, status });
    res.json({
      orders: result.rows.map(formatOrder),
      total: result.count,
      limit,
      offset,
    });
  },

  async getById(req, res) {
    const order = await orderService.getByIdAdmin(req.params.id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json({ order: formatOrder(order) });
  },

  async updateStatus(req, res) {
    try {
      const order = await orderService.updateStatusAdmin(
        req.params.id,
        req.body?.status
      );
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json({ order: formatOrder(order) });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },
};

module.exports = { adminOrderController };
