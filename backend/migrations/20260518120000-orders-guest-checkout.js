'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [constraints] = await queryInterface.sequelize.query(
      `SELECT CONSTRAINT_NAME
       FROM information_schema.TABLE_CONSTRAINTS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'orders'
         AND CONSTRAINT_TYPE = 'FOREIGN KEY'`
    );

    for (const row of constraints) {
      await queryInterface.sequelize.query(
        `ALTER TABLE \`orders\` DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``
      );
    }

    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.STRING(36),
      allowNull: true,
    });

    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'orders_user_id_fk',
      references: {
        table: 'users',
        field: 'id',
      },
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

    await queryInterface.removeConstraint('orders', 'orders_user_id_fk');

    await queryInterface.changeColumn('orders', 'user_id', {
      type: Sequelize.STRING(36),
      allowNull: false,
    });

    await queryInterface.addConstraint('orders', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'orders_ibfk_1',
      references: {
        table: 'users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
