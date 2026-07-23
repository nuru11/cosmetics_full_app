const { productRequestService } = require('./product-request.service');

function formatProductRequest(row) {
  if (!row) return null;
  return row.toJSON ? row.toJSON() : row;
}

const productRequestController = {
  async create(req, res) {
    try {
      const row = await productRequestService.create(
        req.clientDeviceId,
        req.userId || null,
        req.body || {}
      );
      res.status(201).json({ productRequest: formatProductRequest(row) });
    } catch (err) {
      if (err.status) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },
};

module.exports = { productRequestController };
