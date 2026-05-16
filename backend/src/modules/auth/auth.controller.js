const { authService } = require('./auth.service');
const { adminService } = require('../admin/admin.service');

const authController = {
  async register(req, res) {
    const body = req.body || {};
    if (!body.email || !body.password || !body.fullName) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'fullName'],
      });
      return;
    }
    if (typeof body.password !== 'string' || body.password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const result = await authService.register(body);
      res.status(201).json(result);
    } catch (err) {
      if (err.code === 'DUPLICATE_EMAIL') {
        res.status(409).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async login(req, res) {
    const body = req.body || {};
    if (!body.email || !body.password) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password'],
      });
      return;
    }

    const result = await authService.login(body);
    if (!result) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.json(result);
  },

  async adminLogin(req, res) {
    const body = req.body || {};
    if (!body.username || !body.password) {
      res.status(400).json({
        error: 'Missing required fields',
        required: ['username', 'password'],
      });
      return;
    }

    const result = await adminService.login(body);
    if (!result) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    res.json(result);
  },

  async refresh(req, res) {
    const body = req.body || {};
    if (!body.refreshToken) {
      res.status(400).json({
        error: 'Missing required field',
        required: ['refreshToken'],
      });
      return;
    }

    const result = await authService.refresh(body.refreshToken);
    if (!result) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }
    res.json(result);
  },
};

module.exports = { authController };
