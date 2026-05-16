const { cartService } = require('./cart.service');

const cartController = {
  async getCart(req, res) {
    const cart = await cartService.getCart(req.userId);
    res.json({ cart });
  },

  async addItem(req, res) {
    const body = req.body || {};
    if (!body.productId) {
      res.status(400).json({ error: 'Missing required field: productId' });
      return;
    }

    try {
      const cart = await cartService.addItem(req.userId, body);
      res.status(201).json({ cart });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async updateItem(req, res) {
    const quantity = parseInt(req.body?.quantity, 10);
    if (!Number.isFinite(quantity)) {
      res.status(400).json({ error: 'Missing or invalid quantity' });
      return;
    }

    try {
      const cart = await cartService.updateItemQuantity(
        req.userId,
        req.params.productId,
        quantity
      );
      res.json({ cart });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async removeItem(req, res) {
    const cart = await cartService.removeItem(req.userId, req.params.productId);
    res.json({ cart });
  },

  async clearCart(req, res) {
    const cart = await cartService.clearCart(req.userId);
    res.json({ cart });
  },
};

module.exports = { cartController };
