'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('orders', 'client_device_id', {
      type: Sequelize.STRING(64),
      allowNull: true,
      after: 'user_id',
    });

    await queryInterface.addColumn('orders', 'customer_name', {
      type: Sequelize.STRING(120),
      allowNull: true,
      after: 'shipping_address',
    });

    await queryInterface.addColumn('orders', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'customer_name',
    });

    await queryInterface.addColumn('orders', 'city', {
      type: Sequelize.STRING(120),
      allowNull: true,
      after: 'phone',
    });

    await queryInterface.addIndex('orders', ['client_device_id'], {
      name: 'idx_orders_client_device_id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('orders', 'idx_orders_client_device_id');
    await queryInterface.removeColumn('orders', 'city');
    await queryInterface.removeColumn('orders', 'phone');
    await queryInterface.removeColumn('orders', 'customer_name');
    await queryInterface.removeColumn('orders', 'client_device_id');

    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
