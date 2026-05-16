'use strict';

const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const categories = [
      { name: 'Skincare', slug: 'skincare' },
      { name: 'Makeup', slug: 'makeup' },
      { name: 'Fragrance', slug: 'fragrance' },
    ];

    for (const cat of categories) {
      const existing = await queryInterface.rawSelect(
        'categories',
        { where: { slug: cat.slug } },
        ['id']
      );
      if (existing) continue;

      const now = new Date();
      await queryInterface.bulkInsert('categories', [
        {
          id: randomUUID(),
          name: cat.name,
          slug: cat.slug,
          description: null,
          image_url: null,
          is_active: true,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', {
      slug: ['skincare', 'makeup', 'fragrance'],
    });
  },
};
