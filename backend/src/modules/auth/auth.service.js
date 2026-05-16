const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { RefreshToken, User } = require('../../lib/db');
const { config } = require('../../config');

const BCRYPT_ROUNDS = 10;

function toSafeUser(user) {
  if (!user) return null;
  const plain = typeof user.toJSON === 'function' ? user.toJSON() : user;
  const { passwordHash, ...rest } = plain;
  return rest;
}

function accessTokenExpiresInSeconds() {
  const s = config.jwt.accessExpiresIn;
  if (typeof s === 'number') return s;
  if (s.endsWith('m')) return parseInt(s, 10) * 60;
  if (s.endsWith('h')) return parseInt(s, 10) * 3600;
  if (s.endsWith('d')) return parseInt(s, 10) * 86400;
  return 900;
}

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
}

async function createRefreshToken(userId) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const refreshJwt = jwt.sign(
    { sub: userId },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  await RefreshToken.create({
    userId,
    token: refreshJwt,
    expiresAt,
  });

  return refreshJwt;
}

const authService = {
  async register(data) {
    const email = String(data.email || '').trim().toLowerCase();
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const err = new Error('Email already registered');
      err.code = 'DUPLICATE_EMAIL';
      err.status = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await User.create({
      email,
      passwordHash: hashed,
      fullName: data.fullName,
      phone: data.phone || null,
      role: 'CUSTOMER',
    });

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds(),
    };
  },

  async login(data) {
    const email = String(data.email || '').trim().toLowerCase();
    const user = await User.findOne({ where: { email } });
    if (!user || user.status !== 'ACTIVE') return null;

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) return null;

    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.id);

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresInSeconds(),
    };
  },

  async refresh(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch {
      return null;
    }

    const record = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (!record || record.expiresAt < new Date()) return null;

    const user = await User.findOne({ where: { id: payload.sub } });
    if (!user || user.status !== 'ACTIVE') return null;

    await RefreshToken.destroy({ where: { id: record.id } }).catch(() => {});

    const accessToken = signAccessToken(user);
    const newRefreshToken = await createRefreshToken(user.id);

    return {
      user: toSafeUser(user),
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: accessTokenExpiresInSeconds(),
    };
  },
};

module.exports = { authService };
