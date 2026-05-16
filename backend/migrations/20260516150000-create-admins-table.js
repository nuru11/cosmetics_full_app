'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admins', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      full_name: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM('SUPER_ADMIN', 'SALES', 'MARKETER', 'FINANCE'),
        allowNull: false,
        defaultValue: 'SALES',
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      created_at: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      },
      updated_at: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'),
      },
    });

    await queryInterface.addIndex('admins', ['role'], { name: 'admins_role_idx' });
    await queryInterface.addIndex('admins', ['status'], { name: 'admins_status_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('admins');
  },
};
