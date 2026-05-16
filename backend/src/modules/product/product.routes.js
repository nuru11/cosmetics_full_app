const { Router } = require('express');
const { requireAdmin } = require('../../middleware/auth');
const { productController } = require('./product.controller');

const productRoutes = Router();

productRoutes.get('/', (req, res, next) =>
  productController.list(req, res).catch(next)
);
productRoutes.get('/:id', (req, res, next) =>
  productController.getById(req, res).catch(next)
);
productRoutes.post('/', requireAdmin, (req, res, next) =>
  productController.create(req, res).catch(next)
);
productRoutes.patch('/:id', requireAdmin, (req, res, next) =>
  productController.update(req, res).catch(next)
);
productRoutes.delete('/:id', requireAdmin, (req, res, next) =>
  productController.remove(req, res).catch(next)
);

module.exports = productRoutes;
