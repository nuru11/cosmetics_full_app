'use strict';

async function columnExists(queryInterface, tableName, columnName) {
  const table = await queryInterface.describeTable(tableName);
  return Object.prototype.hasOwnProperty.call(table, columnName);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hasInStock = await columnExists(queryInterface, 'product_variants', 'in_stock');
    if (!hasInStock) {
      await queryInterface.addColumn('product_variants', 'in_stock', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      });
    }

    const hasStock = await columnExists(queryInterface, 'product_variants', 'stock');
    if (hasStock) {
      await queryInterface.sequelize.query(
        'UPDATE product_variants SET in_stock = (stock > 0)'
      );
      await queryInterface.removeColumn('product_variants', 'stock');
    }
  },

  async down(queryInterface, Sequelize) {
    const hasStock = await columnExists(queryInterface, 'product_variants', 'stock');
    if (!hasStock) {
      await queryInterface.addColumn('product_variants', 'stock', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    const hasInStock = await columnExists(queryInterface, 'product_variants', 'in_stock');
    if (hasInStock) {
      await queryInterface.sequelize.query(
        'UPDATE product_variants SET stock = CASE WHEN in_stock = 1 THEN 10 ELSE 0 END'
      );
      await queryInterface.removeColumn('product_variants', 'in_stock');
    }
  },
};
