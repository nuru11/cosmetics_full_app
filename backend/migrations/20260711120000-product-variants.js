'use strict';

const { randomUUID } = require('crypto');

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function tableExists(queryInterface, tableName) {
  const tables = await queryInterface.showAllTables();
  const normalized = tables.map((t) =>
    typeof t === 'string' ? t : t.tableName || t.TABLE_NAME
  );
  return normalized.includes(tableName);
}

async function columnExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  return Object.prototype.hasOwnProperty.call(table, columnName);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hasVariantsTable = await tableExists(queryInterface, 'product_variants');

    if (!hasVariantsTable) {
      await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      variant_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sku: {
        type: Sequelize.STRING(80),
        allowNull: true,
        unique: true,
      },
      color: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      size: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      product_version: {
        type: Sequelize.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
        allowNull: false,
        defaultValue: 'ORIGINAL',
      },
      variant_images: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

      await queryInterface.addIndex('product_variants', ['product_id'], {
        name: 'product_variants_product_id_idx',
      });
      await queryInterface.addIndex('product_variants', ['sku'], {
        name: 'product_variants_sku_idx',
      });
    }

    const hasPriceColumn = await columnExists(queryInterface, 'products', 'price');
    const productIdToVariantId = {};
    const usedSlugs = new Set();

    if (hasPriceColumn) {
      const [products] = await queryInterface.sequelize.query(
        `SELECT id, product_name, price, stock, sku, color, size, product_version, product_images, product_description
         FROM products`
      );

      for (const row of products) {
        const [existingRows] = await queryInterface.sequelize.query(
          `SELECT id FROM product_variants WHERE product_id = :productId LIMIT 1`,
          { replacements: { productId: row.id } }
        );
        if (existingRows.length > 0) {
          productIdToVariantId[row.id] = existingRows[0].id;
          continue;
        }

        const variantId = randomUUID();
        productIdToVariantId[row.id] = variantId;

        let images = row.product_images;
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
          } catch {
            images = [];
          }
        }
        if (!Array.isArray(images)) images = [];

        await queryInterface.bulkInsert('product_variants', [
          {
            id: variantId,
            product_id: row.id,
            variant_description: row.product_description || null,
            price: row.price,
            stock: row.stock ?? 0,
            sku: row.sku || null,
            color: row.color || null,
            size: row.size || null,
            product_version: row.product_version || 'ORIGINAL',
            variant_images: JSON.stringify(images),
            sort_order: 0,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ]);

        let baseSlug = slugify(row.product_name);
        if (!baseSlug) baseSlug = 'product';
        let candidate = baseSlug;
        let n = 1;
        while (usedSlugs.has(candidate)) {
          candidate = `${baseSlug}-${n}`;
          n += 1;
        }
        usedSlugs.add(candidate);

        await queryInterface.sequelize.query(
          `UPDATE products SET slug = :slug WHERE id = :id`,
          { replacements: { slug: candidate, id: row.id } }
        );
      }
    } else {
      const [variants] = await queryInterface.sequelize.query(
        `SELECT id, product_id FROM product_variants`
      );
      for (const row of variants) {
        productIdToVariantId[row.product_id] = row.id;
      }
    }

    const cartHasProductId = await columnExists(queryInterface, 'cart_items', 'product_id');
    const cartHasVariantId = await columnExists(queryInterface, 'cart_items', 'variant_id');

    if (!cartHasVariantId) {
      await queryInterface.addColumn('cart_items', 'variant_id', {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        after: cartHasProductId ? 'product_id' : 'cart_id',
      });
    }

    if (cartHasProductId) {
      for (const [productId, variantId] of Object.entries(productIdToVariantId)) {
        await queryInterface.sequelize.query(
          `UPDATE cart_items SET variant_id = :variantId WHERE product_id = :productId`,
          { replacements: { variantId, productId } }
        );
      }

      await queryInterface.sequelize.query('DROP TABLE IF EXISTS `cart_items`');
      await queryInterface.createTable('cart_items', {
        id: {
          type: Sequelize.STRING(36),
          primaryKey: true,
        },
        cart_id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          references: { model: 'carts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        variant_id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          references: { model: 'product_variants', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });
      await queryInterface.addIndex('cart_items', ['cart_id', 'variant_id'], {
        unique: true,
        name: 'cart_items_cart_variant_unique',
      });
      await queryInterface.addIndex('cart_items', ['variant_id'], {
        name: 'cart_items_variant_id_idx',
      });
    } else if (cartHasVariantId) {
      await queryInterface.changeColumn('cart_items', 'variant_id', {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      await queryInterface.addIndex('cart_items', ['cart_id', 'variant_id'], {
        unique: true,
        name: 'cart_items_cart_variant_unique',
      }).catch(() => {});
      await queryInterface.addIndex('cart_items', ['variant_id'], {
        name: 'cart_items_variant_id_idx',
      }).catch(() => {});
    }

    const orderHasVariantId = await columnExists(queryInterface, 'order_items', 'variant_id');
    if (!orderHasVariantId) {
      await queryInterface.addColumn('order_items', 'variant_id', {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        after: 'product_id',
      });
    }

    if (!(await columnExists(queryInterface, 'order_items', 'variant_description'))) {
      await queryInterface.addColumn('order_items', 'variant_description', {
        type: Sequelize.STRING(255),
        allowNull: true,
        after: 'variant_id',
      });
    }
    if (!(await columnExists(queryInterface, 'order_items', 'size'))) {
      await queryInterface.addColumn('order_items', 'size', {
        type: Sequelize.STRING(80),
        allowNull: true,
        after: 'variant_description',
      });
    }
    if (!(await columnExists(queryInterface, 'order_items', 'color'))) {
      await queryInterface.addColumn('order_items', 'color', {
        type: Sequelize.STRING(80),
        allowNull: true,
        after: 'size',
      });
    }
    if (!(await columnExists(queryInterface, 'order_items', 'product_version'))) {
      await queryInterface.addColumn('order_items', 'product_version', {
        type: Sequelize.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
        allowNull: true,
        after: 'color',
      });
    }

    const orderHasProductId = await columnExists(queryInterface, 'order_items', 'product_id');
    if (orderHasProductId) {
      for (const [productId, variantId] of Object.entries(productIdToVariantId)) {
        await queryInterface.sequelize.query(
          `UPDATE order_items oi
           INNER JOIN product_variants pv ON pv.id = :variantId
           SET oi.variant_id = :variantId,
               oi.variant_description = pv.variant_description,
               oi.size = pv.size,
               oi.color = pv.color,
               oi.product_version = pv.product_version
           WHERE oi.product_id = :productId`,
          { replacements: { variantId, productId } }
        );
      }
    }

    await queryInterface.changeColumn('order_items', 'variant_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      references: { model: 'product_variants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
    await queryInterface.addIndex('order_items', ['variant_id'], {
      name: 'order_items_variant_id_idx',
    }).catch(() => {});

    if (hasPriceColumn) {
      const dropProductColumns = [
        'price',
        'stock',
        'sku',
        'color',
        'size',
        'product_version',
        'product_images',
      ];
      for (const column of dropProductColumns) {
        if (await columnExists(queryInterface, 'products', column)) {
          await queryInterface.sequelize.query(
            `ALTER TABLE \`products\` DROP COLUMN \`${column}\``
          );
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'price', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'stock', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn('products', 'sku', {
      type: Sequelize.STRING(80),
      allowNull: true,
      unique: true,
    });
    await queryInterface.addColumn('products', 'color', {
      type: Sequelize.STRING(80),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'size', {
      type: Sequelize.STRING(80),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'product_version', {
      type: Sequelize.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
      allowNull: false,
      defaultValue: 'ORIGINAL',
    });
    await queryInterface.addColumn('products', 'product_images', {
      type: Sequelize.JSON,
      allowNull: true,
    });

    const [variants] = await queryInterface.sequelize.query(
      `SELECT * FROM product_variants ORDER BY sort_order ASC`
    );

    const productFirstVariant = {};
    for (const v of variants) {
      if (!productFirstVariant[v.product_id]) {
        productFirstVariant[v.product_id] = v;
        let images = v.variant_images;
        if (typeof images === 'string') {
          try {
            images = JSON.parse(images);
          } catch {
            images = [];
          }
        }
        await queryInterface.sequelize.query(
          `UPDATE products SET
            price = :price, stock = :stock, sku = :sku, color = :color, size = :size,
            product_version = :productVersion, product_images = :images
           WHERE id = :productId`,
          {
            replacements: {
              price: v.price,
              stock: v.stock,
              sku: v.sku,
              color: v.color,
              size: v.size,
              productVersion: v.product_version,
              images: JSON.stringify(images || []),
              productId: v.product_id,
            },
          }
        );
      }
    }

    await queryInterface.removeIndex('order_items', 'order_items_variant_id_idx').catch(() => {});
    await queryInterface.removeColumn('order_items', 'product_version');
    await queryInterface.removeColumn('order_items', 'color');
    await queryInterface.removeColumn('order_items', 'size');
    await queryInterface.removeColumn('order_items', 'variant_description');
    await queryInterface.removeColumn('order_items', 'variant_id');

    await queryInterface.removeIndex('cart_items', 'cart_items_variant_id_idx').catch(() => {});
    await queryInterface.removeIndex('cart_items', 'cart_items_cart_variant_unique').catch(() => {});
    await queryInterface.addColumn('cart_items', 'product_id', {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    for (const v of variants) {
      await queryInterface.sequelize.query(
        `UPDATE cart_items SET product_id = :productId WHERE variant_id = :variantId`,
        { replacements: { productId: v.product_id, variantId: v.id } }
      );
    }

    await queryInterface.removeColumn('cart_items', 'variant_id');
    await queryInterface.changeColumn('cart_items', 'product_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await queryInterface.addIndex('cart_items', ['cart_id', 'product_id'], {
      unique: true,
      name: 'cart_items_cart_id_product_id',
    });

    await queryInterface.dropTable('product_variants');
  },
};
