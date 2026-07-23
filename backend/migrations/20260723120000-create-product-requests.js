'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_requests', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      customer_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      client_device_id: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('NEW', 'REVIEWED', 'FULFILLED', 'CLOSED'),
        allowNull: false,
        defaultValue: 'NEW',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('product_requests', ['status'], {
      name: 'idx_product_requests_status',
    });
    await queryInterface.addIndex('product_requests', ['client_device_id'], {
      name: 'idx_product_requests_client_device_id',
    });
    await queryInterface.addIndex('product_requests', ['created_at'], {
      name: 'idx_product_requests_created_at',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_requests');
  },
};
