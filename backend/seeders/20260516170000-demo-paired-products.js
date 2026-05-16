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
    const now = new Date();

    const variants = [
      {
        product_version: 'ORIGINAL',
        slug: 'miss-dior-blooming-bouquet-original',
        sku: 'DIOR-MDBB-ORIG',
        price: 120,
        product_description: 'Authentic sealed, full box',
      },
      {
        product_version: 'TWO_LEVEL',
        slug: 'miss-dior-blooming-bouquet-two-level',
        sku: 'DIOR-MDBB-2ND',
        price: 45,
        product_description: 'Same product, no box',
      },
      {
        product_version: 'PREMIUM',
        slug: 'miss-dior-blooming-bouquet-premium',
        sku: 'DIOR-MDBB-PREM',
        price: 95,
        product_description: 'Premium / limited edition',
      },
    ];

    for (const v of variants) {
      const existing = await queryInterface.rawSelect(
        'products',
        { where: { slug: v.slug } },
        ['id']
      );
      if (existing) continue;

      await queryInterface.bulkInsert('products', [
        {
          id: randomUUID(),
          category_id: categoryId,
          product_name: productName,
          slug: v.slug,
          sku: v.sku,
          brand,
          product_description: v.product_description,
          product_images: JSON.stringify([]),
          price: v.price,
          gender: 'FEMALE',
          status: 'ACTIVE',
          product_version: v.product_version,
          stock: 10,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', {
      slug: [
        'miss-dior-blooming-bouquet-original',
        'miss-dior-blooming-bouquet-two-level',
        'miss-dior-blooming-bouquet-premium',
      ],
    });
  },
};
