const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { cartController } = require('./cart.controller');

const cartRoutes = Router();

cartRoutes.use(requireAuth);

cartRoutes.get('/', (req, res, next) =>
  cartController.getCart(req, res).catch(next)
);
cartRoutes.post('/items', (req, res, next) =>
  cartController.addItem(req, res).catch(next)
);
cartRoutes.patch('/items/:variantId', (req, res, next) =>
  cartController.updateItem(req, res).catch(next)
);
cartRoutes.delete('/items/:variantId', (req, res, next) =>
  cartController.removeItem(req, res).catch(next)
);
cartRoutes.delete('/', (req, res, next) =>
  cartController.clearCart(req, res).catch(next)
);

module.exports = cartRoutes;
