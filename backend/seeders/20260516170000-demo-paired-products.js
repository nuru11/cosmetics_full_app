'use strict';

const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categoryId = await queryInterface.rawSelect(
      'categories',
      { where: { slug: 'fragrance' } },
      ['id']
    );
    if (!categoryId) return;

    const productName = 'Miss Dior Blooming Bouquet';
    const brand = 'DIOR';
    const slug = 'miss-dior-blooming-bouquet';
    const now = new Date();

    const existingProduct = await queryInterface.rawSelect(
      'products',
      { where: { slug } },
      ['id']
    );

    let productId = existingProduct;

    if (!productId) {
      const oldSlugs = [
        'miss-dior-blooming-bouquet-original',
        'miss-dior-blooming-bouquet-two-level',
        'miss-dior-blooming-bouquet-premium',
      ];

      const [oldRows] = await queryInterface.sequelize.query(
        `SELECT id FROM products WHERE slug IN (:slugs) LIMIT 1`,
        { replacements: { slugs: oldSlugs } }
      );

      if (oldRows.length > 0) {
        productId = oldRows[0].id;
        await queryInterface.sequelize.query(
          `UPDATE products SET slug = :slug, product_name = :productName, brand = :brand,
           product_description = :description, gender = 'FEMALE', status = 'ACTIVE'
           WHERE id = :id`,
          {
            replacements: {
              slug,
              productName,
              brand,
              description: 'Eau de toilette floral fragrance',
              id: productId,
            },
          }
        );

        const [otherOld] = await queryInterface.sequelize.query(
          `SELECT id FROM products WHERE slug IN (:slugs) AND id != :keepId`,
          { replacements: { slugs: oldSlugs, keepId: productId } }
        );
        for (const row of otherOld) {
          await queryInterface.sequelize.query(
            `DELETE FROM products WHERE id = :id`,
            { replacements: { id: row.id } }
          );
        }
      } else {
        productId = randomUUID();
        await queryInterface.bulkInsert('products', [
          {
            id: productId,
            category_id: categoryId,
            product_name: productName,
            slug,
            brand,
            product_description: 'Eau de toilette floral fragrance',
            gender: 'FEMALE',
            status: 'ACTIVE',
            created_at: now,
            updated_at: now,
          },
        ]);
      }
    }

    const variants = [
      {
        product_version: 'ORIGINAL',
        sku: 'DIOR-MDBB-ORIG',
        price: 120,
        variant_description: 'Authentic sealed, full box',
        sort_order: 0,
      },
      {
        product_version: 'TWO_LEVEL',
        sku: 'DIOR-MDBB-2ND',
        price: 45,
        variant_description: 'Same product, no box',
        sort_order: 1,
      },
      {
        product_version: 'PREMIUM',
        sku: 'DIOR-MDBB-PREM',
        price: 95,
        variant_description: 'Premium / limited edition',
        sort_order: 2,
      },
    ];

    for (const v of variants) {
      const existingSku = await queryInterface.rawSelect(
        'product_variants',
        { where: { sku: v.sku } },
        ['id']
      );
      if (existingSku) continue;

      await queryInterface.bulkInsert('product_variants', [
        {
          id: randomUUID(),
          product_id: productId,
          variant_description: v.variant_description,
          price: v.price,
          product_version: v.product_version,
          in_stock: true,
          sku: v.sku,
          variant_images: JSON.stringify([]),
          sort_order: v.sort_order,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    const productId = await queryInterface.rawSelect(
      'products',
      { where: { slug: 'miss-dior-blooming-bouquet' } },
      ['id']
    );
    if (!productId) return;

    await queryInterface.bulkDelete('product_variants', { product_id: productId });
    await queryInterface.bulkDelete('products', { id: productId });
  },
};
