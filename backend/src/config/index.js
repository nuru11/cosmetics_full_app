const { config: loadEnv } = require('dotenv');

loadEnv();

if (!process.env.DATABASE_URL && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  const pass = process.env.DB_PASS ? encodeURIComponent(process.env.DB_PASS) : '';
  const port = process.env.DB_PORT || '3306';
  process.env.DATABASE_URL = `mysql://${process.env.DB_USER}:${pass}@${process.env.DB_HOST}:${port}/${process.env.DB_NAME}`;
}

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};

module.exports = { config };
