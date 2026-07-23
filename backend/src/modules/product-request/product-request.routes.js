const { Router } = require('express');
const { optionalAuth } = require('../../middleware/auth');
const { requireDeviceId } = require('../../middleware/deviceId');
const { productRequestController } = require('./product-request.controller');

const productRequestRoutes = Router();

productRequestRoutes.use(optionalAuth);
productRequestRoutes.use(requireDeviceId);

productRequestRoutes.post('/', (req, res, next) =>
  productRequestController.create(req, res).catch(next)
);

module.exports = productRequestRoutes;
