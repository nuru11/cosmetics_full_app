const { Router } = require('express');
const { requireAdmin } = require('../../middleware/auth');
const { adminProductRequestController } = require('./admin.product-request.controller');

const adminProductRequestRoutes = Router();

adminProductRequestRoutes.use(requireAdmin);

adminProductRequestRoutes.get('/', (req, res, next) =>
  adminProductRequestController.list(req, res).catch(next)
);
adminProductRequestRoutes.get('/:id', (req, res, next) =>
  adminProductRequestController.getById(req, res).catch(next)
);
adminProductRequestRoutes.patch('/:id', (req, res, next) =>
  adminProductRequestController.updateStatus(req, res).catch(next)
);

module.exports = adminProductRequestRoutes;
