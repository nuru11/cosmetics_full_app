const { Op } = require('sequelize');
const { Category } = require('../../lib/db');
const { uniqueSlug } = require('../../lib/slug');

const categoryService = {
  async list({ activeOnly = true } = {}) {
    const where = activeOnly ? { isActive: true } : {};
    return Category.findAll({ where, order: [['name', 'ASC']] });
  },

  async getById(id) {
    return Category.findOne({ where: { id } });
  },

  async create(data) {
    const slug = await uniqueSlug(data.name, (s) =>
      Category.findOne({ where: { slug: s } }).then(Boolean)
    );
    return Category.create({
      name: data.name,
      slug,
      description: data.description || null,
      imageUrl: data.imageUrl || null,
      isActive: data.isActive !== false,
    });
  },

  async update(id, data) {
    const category = await Category.findOne({ where: { id } });
    if (!category) return null;

    const updates = {};
    if (data.name != null) {
      updates.name = data.name;
      updates.slug = await uniqueSlug(data.name, (s) =>
        Category.findOne({ where: { slug: s, id: { [Op.ne]: id } } }).then(Boolean)
      );
    }
    if (data.description != null) updates.description = data.description;
    if (Object.prototype.hasOwnProperty.call(data, 'imageUrl')) {
      updates.imageUrl = data.imageUrl;
    }
    if (data.isActive != null) updates.isActive = data.isActive;

    await category.update(updates);
    return category.reload();
  },

  async remove(id) {
    const category = await Category.findOne({ where: { id } });
    if (!category) return false;
    await category.destroy();
    return true;
  },
};

module.exports = { categoryService };
