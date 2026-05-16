const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../../lib/db');
const { config } = require('../../config');

const BCRYPT_ROUNDS = 10;
const STAFF_ROLES = new Set(['SUPER_ADMIN', 'SALES', 'MARKETER', 'FINANCE']);

function toSafeAdmin(admin) {
  if (!admin) return null;
  const plain = typeof admin.toJSON === 'function' ? admin.toJSON() : admin;
  const { passwordHash, ...rest } = plain;
  return {
    id: rest.id,
    username: rest.username,
    fullName: rest.fullName,
    referenceId: rest.referenceId ?? null,
    phone: rest.phone ?? null,
    email: rest.email ?? null,
    role: rest.role,
    status: rest.status,
    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  };
}

function accessTokenExpiresInSeconds() {
  const s = config.jwt.accessExpiresIn;
  if (typeof s === 'number') return s;
  if (s.endsWith('m')) return parseInt(s, 10) * 60;
  if (s.endsWith('h')) return parseInt(s, 10) * 3600;
  if (s.endsWith('d')) return parseInt(s, 10) * 86400;
  return 900;
}

function signAdminAccessToken(admin) {
  return jwt.sign(
    { sub: admin.id, role: admin.role, actor: 'admin' },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
}

function isStaffRole(role) {
  if (!role) return false;
  if (role === 'ADMIN') return true;
  return STAFF_ROLES.has(String(role).toUpperCase());
}

const adminService = {
  isStaffRole,

  async login(data) {
    const username = String(data.username || '').trim();
    if (!username) return null;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin || admin.status !== 'ACTIVE') return null;

    const ok = await bcrypt.compare(data.password, admin.passwordHash);
    if (!ok) return null;

    const accessToken = signAdminAccessToken(admin);

    return {
      admin: toSafeAdmin(admin),
      accessToken,
      expiresIn: accessTokenExpiresInSeconds(),
    };
  },
};

module.exports = { adminService, toSafeAdmin, signAdminAccessToken };
