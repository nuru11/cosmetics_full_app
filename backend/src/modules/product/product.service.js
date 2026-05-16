const { Op } = require('sequelize');
const { Category, Product } = require('../../lib/db');
const { uniqueSlug } = require('../../lib/slug');
const { assertProductEnums } = require('../../lib/productEnums');

const productService = {
  async list({
    categoryId,
    activeOnly = true,
    gender,
    brand,
    status,
    productVersion,
  } = {}) {
    const where = {};
    if (activeOnly) where.status = 'ACTIVE';
    if (categoryId) where.categoryId = categoryId;
    if (gender) where.gender = String(gender).toUpperCase();
    if (brand) where.brand = brand;
    if (status) where.status = String(status).toUpperCase();
    if (productVersion) where.productVersion = String(productVersion).toUpperCase();

    return Product.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      order: [['createdAt', 'DESC']],
    });
  },

  async getById(id) {
    return Product.findOne({
      where: { id },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
    });
  },

  async create(data) {
    assertProductEnums(data);

    const category = await Category.findOne({ where: { id: data.categoryId } });
    if (!category) {
      const err = new Error('Category not found');
      err.status = 400;
      throw err;
    }

    const version = data.productVersion || 'ORIGINAL';
    const slugBase = `${data.productName}-${version}`;
    const slug = await uniqueSlug(slugBase, (s) =>
      Product.findOne({ where: { slug: s } }).then(Boolean)
    );

    return Product.create({
      categoryId: data.categoryId,
      productName: data.productName,
      slug,
      productDescription: data.productDescription || null,
      productImages: data.productImages || [],
      price: data.price,
      gender: data.gender || 'UNISEX',
      brand: data.brand || null,
      status: data.status || 'ACTIVE',
      productVersion: version,
      color: data.color || null,
      size: data.size || null,
      stock: data.stock ?? 0,
      sku: data.sku || null,
    });
  },

  async update(id, data) {
    assertProductEnums(data, { partial: true });

    const product = await Product.findOne({ where: { id } });
    if (!product) return null;

    const updates = {};
    if (data.categoryId != null) updates.categoryId = data.categoryId;
    if (data.productName != null) {
      updates.productName = data.productName;
      const version =
        data.productVersion != null
          ? data.productVersion
          : product.productVersion;
      const slugBase = `${data.productName}-${version}`;
      updates.slug = await uniqueSlug(slugBase, (s) =>
        Product.findOne({ where: { slug: s, id: { [Op.ne]: id } } }).then(Boolean)
      );
    } else if (data.productVersion != null) {
      const slugBase = `${product.productName}-${data.productVersion}`;
      updates.slug = await uniqueSlug(slugBase, (s) =>
        Product.findOne({ where: { slug: s, id: { [Op.ne]: id } } }).then(Boolean)
      );
    }
    if (data.productDescription != null) updates.productDescription = data.productDescription;
    if (data.productImages != null) updates.productImages = data.productImages;
    if (data.price != null) updates.price = data.price;
    if (data.gender != null) updates.gender = data.gender;
    if (data.brand != null) updates.brand = data.brand;
    if (data.status != null) updates.status = data.status;
    if (data.productVersion != null) updates.productVersion = data.productVersion;
    if (data.color != null) updates.color = data.color;
    if (data.size != null) updates.size = data.size;
    if (data.stock != null) updates.stock = data.stock;
    if (data.sku != null) updates.sku = data.sku;

    await product.update(updates);
    return this.getById(id);
  },

  async remove(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) return false;
    await product.destroy();
    return true;
  },
};

module.exports = { productService };
