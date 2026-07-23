const { ProductRequest } = require('../../lib/db');
const { validateCreateBody } = require('./product-request.validation');
const { validateProductRequestStatus } = require('./product-request.status');
const { saveProductRequestImage } = require('./product-request.image');

const productRequestService = {
  async create(clientDeviceId, userId, body = {}) {
    const validated = validateCreateBody(body);
    const imageUrl = saveProductRequestImage(body.imageBase64);

    return ProductRequest.create({
      description: validated.description,
      imageUrl,
      customerName: validated.customerName,
      phone: validated.phone,
      city: validated.city,
      clientDeviceId,
      userId: userId || null,
      status: 'NEW',
    });
  },

  async listAllAdmin({ limit = 50, offset = 0, status } = {}) {
    const where = {};
    if (status) {
      where.status = validateProductRequestStatus(status);
    }

    return ProductRequest.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
  },

  async getByIdAdmin(id) {
    return ProductRequest.findByPk(id);
  },

  async updateStatusAdmin(id, status) {
    const normalized = validateProductRequestStatus(status);
    const row = await ProductRequest.findByPk(id);
    if (!row) return null;

    row.status = normalized;
    await row.save();
    return row;
  },
};

module.exports = { productRequestService };
