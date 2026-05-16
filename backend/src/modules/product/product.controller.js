const { productService } = require('./product.service');

const productController = {
  async list(req, res) {
    const activeOnly = req.query.activeOnly !== 'false';
    const products = await productService.list({
      categoryId: req.query.categoryId || undefined,
      activeOnly,
      gender: req.query.gender || undefined,
      brand: req.query.brand || undefined,
      status: req.query.status || undefined,
      productVersion: req.query.productVersion || undefined,
    });
    res.json({ products });
  },

  async getById(req, res) {
    const product = await productService.getById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product });
  },

  async create(req, res) {
    const body = req.body || {};
    if (!body.productName || body.price == null || !body.categoryId) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['productName', 'price', 'categoryId'],
      });
      return;
    }

    try {
      const product = await productService.create(body);
      res.status(201).json({ product });
    } catch (err) {
      if (err.status === 400) {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async update(req, res) {
    try {
      const product = await productService.update(req.params.id, req.body || {});
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ product });
    } catch (err) {
      if (err.status === 400) {
        res.status(400).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async remove(req, res) {
    const ok = await productService.remove(req.params.id);
    if (!ok) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(204).send();
  },
};

module.exports = { productController };
