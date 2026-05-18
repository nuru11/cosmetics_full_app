const { Router } = require('express');
const { requireAdmin } = require('../../middleware/auth');
const { adminOrderController } = require('./admin.order.controller');

const adminOrderRoutes = Router();

adminOrderRoutes.use(requireAdmin);

adminOrderRoutes.get('/', (req, res, next) =>
  adminOrderController.list(req, res).catch(next)
);
adminOrderRoutes.get('/:id', (req, res, next) =>
  adminOrderController.getById(req, res).catch(next)
);
adminOrderRoutes.patch('/:id', (req, res, next) =>
  adminOrderController.updateStatus(req, res).catch(next)
);

module.exports = adminOrderRoutes;
