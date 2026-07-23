const { Op } = require('sequelize');
const {
  Category,
  Product,
  ProductVariant,
  sequelize,
} = require('../../lib/db');
const { uniqueSlug } = require('../../lib/slug');
const { assertProductEnums } = require('../../lib/productEnums');

const productIncludes = [
  { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
  {
    model: ProductVariant,
    as: 'variants',
    separate: true,
    order: [
      ['sortOrder', 'ASC'],
      ['createdAt', 'ASC'],
    ],
  },
];

function parseInStock(value) {
  if (value == null) return true;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
    const asNumber = parseInt(normalized, 10);
    if (Number.isFinite(asNumber)) return asNumber > 0;
  }
  return Boolean(value);
}

function normalizeVariantInput(raw, index = 0) {
  const variant = raw || {};
  assertProductEnums(variant, { partial: true });

  const variantDescription = (
    variant.variantDescription ??
    variant.variant_description ??
    ''
  ).trim();
  const size = (variant.size || '').trim();
  const color = (variant.color || '').trim();

  if (!variantDescription && !size) {
    const err = new Error(
      `Variant ${index + 1}: variantDescription or size is required`
    );
    err.status = 400;
    throw err;
  }

  const price = Number(variant.price);
  if (!Number.isFinite(price) || price <= 0) {
    const err = new Error(`Variant ${index + 1}: price must be greater than zero`);
    err.status = 400;
    throw err;
  }

  const inStock = parseInStock(
    variant.inStock ?? variant.in_stock ?? variant.stock
  );

  return {
    id: variant.id || null,
    variantDescription: variantDescription || null,
    price,
    inStock,
    sku: (variant.sku || '').trim() || null,
    color: color || null,
    size: size || null,
    productVersion: variant.productVersion || variant.product_version || 'ORIGINAL',
    variantImages: variant.variantImages || variant.variant_images || [],
    sortOrder: variant.sortOrder ?? variant.sort_order ?? index,
  };
}

function assertUniqueVariantCombos(variants) {
  const seen = new Set();
  for (const v of variants) {
    const key = [
      (v.size || '').toLowerCase(),
      (v.color || '').toLowerCase(),
      String(v.productVersion).toUpperCase(),
    ].join('|');
    if (seen.has(key)) {
      const err = new Error(
        'Duplicate variant combination (size + color + productVersion)'
      );
      err.status = 400;
      throw err;
    }
    seen.add(key);
  }
}

function variantPrimaryImage(variant) {
  const images = variant?.variantImages || variant?.variant_images || [];
  return Array.isArray(images) && images.length > 0 ? images[0] : null;
}

function serializeProduct(product) {
  const json = product.toJSON ? product.toJSON() : product;
  const variants = json.variants || [];
  const prices = variants
    .map((v) => parseFloat(v.price))
    .filter((p) => Number.isFinite(p));

  const displayPrice = prices.length > 0 ? Math.min(...prices) : null;
  const displayPriceMax = prices.length > 0 ? Math.max(...prices) : null;
  const displayImage =
    variants.map(variantPrimaryImage).find(Boolean) || null;

  return {
    ...json,
    variantCount: variants.length,
    displayPrice,
    displayPriceMax,
    displayImage,
  };
}

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

    const variantWhere = {};
    if (productVersion) {
      variantWhere.productVersion = String(productVersion).toUpperCase();
    }

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] },
        {
          model: ProductVariant,
          as: 'variants',
          where: Object.keys(variantWhere).length ? variantWhere : undefined,
          required: !!productVersion,
          separate: true,
          order: [
            ['sortOrder', 'ASC'],
            ['createdAt', 'ASC'],
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return products.map(serializeProduct);
  },

  async getById(id) {
    const product = await Product.findOne({
      where: { id },
      include: productIncludes,
    });
    return product ? serializeProduct(product) : null;
  },

  async create(data) {
    assertProductEnums(data);

    const variantsInput = Array.isArray(data.variants) ? data.variants : [];
    if (variantsInput.length === 0) {
      const err = new Error('At least one variant is required');
      err.status = 400;
      throw err;
    }

    const category = await Category.findOne({ where: { id: data.categoryId } });
    if (!category) {
      const err = new Error('Category not found');
      err.status = 400;
      throw err;
    }

    const variants = variantsInput.map(normalizeVariantInput);
    assertUniqueVariantCombos(variants);

    const slug = await uniqueSlug(data.productName, (s) =>
      Product.findOne({ where: { slug: s } }).then(Boolean)
    );

    return sequelize.transaction(async (t) => {
      const product = await Product.create(
        {
          categoryId: data.categoryId,
          productName: data.productName,
          slug,
          productDescription: data.productDescription || null,
          gender: data.gender || 'UNISEX',
          brand: data.brand || null,
          status: data.status || 'ACTIVE',
        },
        { transaction: t }
      );

      for (const variant of variants) {
        await ProductVariant.create(
          {
            productId: product.id,
            variantDescription: variant.variantDescription,
            price: variant.price,
            inStock: variant.inStock,
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            productVersion: variant.productVersion,
            variantImages: variant.variantImages,
            sortOrder: variant.sortOrder,
          },
          { transaction: t }
        );
      }

      return Product.findOne({
        where: { id: product.id },
        include: productIncludes,
        transaction: t,
      }).then(serializeProduct);
    });
  },

  async update(id, data) {
    assertProductEnums(data, { partial: true });

    const product = await Product.findOne({ where: { id } });
    if (!product) return null;

    return sequelize.transaction(async (t) => {
      const updates = {};
      if (data.categoryId != null) updates.categoryId = data.categoryId;
      if (data.productName != null) {
        updates.productName = data.productName;
        updates.slug = await uniqueSlug(data.productName, (s) =>
          Product.findOne({ where: { slug: s, id: { [Op.ne]: id } } }).then(
            Boolean
          )
        );
      }
      if (data.productDescription != null) {
        updates.productDescription = data.productDescription;
      }
      if (data.gender != null) updates.gender = data.gender;
      if (data.brand != null) updates.brand = data.brand;
      if (data.status != null) updates.status = data.status;

      if (Object.keys(updates).length > 0) {
        await product.update(updates, { transaction: t });
      }

      if (Array.isArray(data.variants)) {
        if (data.variants.length === 0) {
          const err = new Error('At least one variant is required');
          err.status = 400;
          throw err;
        }

        const variants = data.variants.map(normalizeVariantInput);
        assertUniqueVariantCombos(variants);

        const existing = await ProductVariant.findAll({
          where: { productId: id },
          transaction: t,
        });
        const existingById = new Map(existing.map((v) => [v.id, v]));
        const keepIds = new Set();

        for (const variant of variants) {
          if (variant.id && existingById.has(variant.id)) {
            keepIds.add(variant.id);
            await existingById.get(variant.id).update(
              {
                variantDescription: variant.variantDescription,
                price: variant.price,
                inStock: variant.inStock,
                sku: variant.sku,
                color: variant.color,
                size: variant.size,
                productVersion: variant.productVersion,
                variantImages: variant.variantImages,
                sortOrder: variant.sortOrder,
              },
              { transaction: t }
            );
          } else {
            const created = await ProductVariant.create(
              {
                productId: id,
                variantDescription: variant.variantDescription,
                price: variant.price,
                inStock: variant.inStock,
                sku: variant.sku,
                color: variant.color,
                size: variant.size,
                productVersion: variant.productVersion,
                variantImages: variant.variantImages,
                sortOrder: variant.sortOrder,
              },
              { transaction: t }
            );
            keepIds.add(created.id);
          }
        }

        const toDelete = existing.filter((v) => !keepIds.has(v.id));
        if (toDelete.length > 0) {
          await ProductVariant.destroy({
            where: { id: { [Op.in]: toDelete.map((v) => v.id) } },
            transaction: t,
          });
        }
      }

      return Product.findOne({
        where: { id },
        include: productIncludes,
        transaction: t,
      }).then(serializeProduct);
    });
  },

  async remove(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) return false;
    await product.destroy();
    return true;
  },
};

module.exports = { productService, serializeProduct };
