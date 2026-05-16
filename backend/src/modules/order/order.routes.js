const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { orderController } = require('./order.controller');

const orderRoutes = Router();

orderRoutes.use(requireAuth);

orderRoutes.post('/checkout', (req, res, next) =>
  orderController.checkout(req, res).catch(next)
);
orderRoutes.get('/', (req, res, next) =>
  orderController.list(req, res).catch(next)
);
orderRoutes.get('/:id', (req, res, next) =>
  orderController.getById(req, res).catch(next)
);

module.exports = orderRoutes;
