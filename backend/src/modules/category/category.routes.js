const { Router } = require('express');
const { requireAdmin } = require('../../middleware/auth');
const { categoryController } = require('./category.controller');

const categoryRoutes = Router();

categoryRoutes.get('/', (req, res, next) =>
  categoryController.list(req, res).catch(next)
);
categoryRoutes.get('/:id', (req, res, next) =>
  categoryController.getById(req, res).catch(next)
);
categoryRoutes.post('/', requireAdmin, (req, res, next) =>
  categoryController.create(req, res).catch(next)
);
categoryRoutes.patch('/:id', requireAdmin, (req, res, next) =>
  categoryController.update(req, res).catch(next)
);
categoryRoutes.delete('/:id', requireAdmin, (req, res, next) =>
  categoryController.remove(req, res).catch(next)
);

module.exports = categoryRoutes;
