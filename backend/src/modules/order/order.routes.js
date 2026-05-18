const { Router } = require('express');
const { optionalAuth } = require('../../middleware/auth');
const { requireDeviceId } = require('../../middleware/deviceId');
const { orderController } = require('./order.controller');

const orderRoutes = Router();

orderRoutes.use(optionalAuth);
orderRoutes.use(requireDeviceId);

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
