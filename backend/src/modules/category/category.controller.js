const { categoryService } = require('./category.service');

const categoryController = {
  async list(req, res) {
    const activeOnly = req.query.activeOnly !== 'false';
    const categories = await categoryService.list({ activeOnly });
    res.json({ categories });
  },

  async getById(req, res) {
    const category = await categoryService.getById(req.params.id);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json({ category });
  },

  async create(req, res) {
    const body = req.body || {};
    if (!body.name) {
      res.status(400).json({ error: 'Missing required field: name' });
      return;
    }
    const category = await categoryService.create(body);
    res.status(201).json({ category });
  },

  async update(req, res) {
    const category = await categoryService.update(req.params.id, req.body || {});
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.json({ category });
  },

  async remove(req, res, next) {
    try {
      const ok = await categoryService.remove(req.params.id);
      if (!ok) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      if (err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(409).json({
          error: 'Cannot delete: products still use this category. Deactivate it instead.',
        });
        return;
      }
      next(err);
    }
  },
};

module.exports = { categoryController };
