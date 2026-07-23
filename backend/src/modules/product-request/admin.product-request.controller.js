const { productRequestService } = require('./product-request.service');

function formatProductRequest(row) {
  if (!row) return null;
  return row.toJSON ? row.toJSON() : row;
}

const adminProductRequestController = {
  async list(req, res) {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const status = req.query.status ? String(req.query.status).trim() : undefined;

    const result = await productRequestService.listAllAdmin({ limit, offset, status });
    res.json({
      productRequests: result.rows.map(formatProductRequest),
      total: result.count,
      limit,
      offset,
    });
  },

  async getById(req, res) {
    const row = await productRequestService.getByIdAdmin(req.params.id);
    if (!row) {
      res.status(404).json({ error: 'Product request not found' });
      return;
    }
    res.json({ productRequest: formatProductRequest(row) });
  },

  async updateStatus(req, res) {
    try {
      const row = await productRequestService.updateStatusAdmin(
        req.params.id,
        req.body?.status
      );
      if (!row) {
        res.status(404).json({ error: 'Product request not found' });
        return;
      }
      res.json({ productRequest: formatProductRequest(row) });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },
};

module.exports = { adminProductRequestController };
