'use strict';

const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const username = (process.env.ADMIN_USERNAME || 'admin').trim();
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashed = await bcrypt.hash(password, 10);
    const id = randomUUID();

    const existing = await queryInterface.rawSelect(
      'admins',
      { where: { username } },
      ['id']
    );
    if (existing) return;

    await queryInterface.bulkInsert('admins', [
      {
        id,
        username,
        password_hash: hashed,
        full_name: 'Admin',
        reference_id: null,
        phone: null,
        email: null,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    const username = (process.env.ADMIN_USERNAME || 'admin').trim();
    await queryInterface.bulkDelete('admins', { username });
  },
};
