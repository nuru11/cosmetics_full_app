'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('products', 'name', 'product_name');
    await queryInterface.renameColumn('products', 'description', 'product_description');
    await queryInterface.renameColumn('products', 'image_urls', 'product_images');

    await queryInterface.addColumn('products', 'gender', {
      type: Sequelize.ENUM('MALE', 'FEMALE', 'UNISEX'),
      allowNull: false,
      defaultValue: 'UNISEX',
      after: 'price',
    });

    await queryInterface.addColumn('products', 'brand', {
      type: Sequelize.STRING(120),
      allowNull: true,
      after: 'gender',
    });

    await queryInterface.addColumn('products', 'status', {
      type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'UNAVAILABLE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      after: 'brand',
    });

    await queryInterface.addColumn('products', 'product_version', {
      type: Sequelize.ENUM('ORIGINAL', 'TWO_LEVEL', 'PREMIUM'),
      allowNull: false,
      defaultValue: 'ORIGINAL',
      after: 'status',
    });

    await queryInterface.addColumn('products', 'color', {
      type: Sequelize.STRING(80),
      allowNull: true,
      after: 'product_version',
    });

    await queryInterface.addColumn('products', 'size', {
      type: Sequelize.STRING(80),
      allowNull: true,
      after: 'color',
    });

    await queryInterface.sequelize.query(
      `UPDATE products SET status = CASE WHEN is_active = 1 THEN 'ACTIVE' ELSE 'INACTIVE' END`
    );

    await queryInterface.removeIndex('products', ['is_active']).catch(() => {});
    await queryInterface.removeColumn('products', 'is_active');

    await queryInterface.addIndex('products', ['status'], { name: 'products_status_idx' });
    await queryInterface.addIndex('products', ['gender'], { name: 'products_gender_idx' });
    await queryInterface.addIndex('products', ['brand'], { name: 'products_brand_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('products', 'products_status_idx').catch(() => {});
    await queryInterface.removeIndex('products', 'products_gender_idx').catch(() => {});
    await queryInterface.removeIndex('products', 'products_brand_idx').catch(() => {});

    await queryInterface.addColumn('products', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    await queryInterface.sequelize.query(
      `UPDATE products SET is_active = CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END`
    );

    await queryInterface.removeColumn('products', 'size');
    await queryInterface.removeColumn('products', 'color');
    await queryInterface.removeColumn('products', 'product_version');
    await queryInterface.removeColumn('products', 'status');
    await queryInterface.removeColumn('products', 'brand');
    await queryInterface.removeColumn('products', 'gender');

    await queryInterface.renameColumn('products', 'product_images', 'image_urls');
    await queryInterface.renameColumn('products', 'product_description', 'description');
    await queryInterface.renameColumn('products', 'product_name', 'name');
  },
};
