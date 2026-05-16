const { Router } = require('express');
const { authController } = require('./auth.controller');

const authRoutes = Router();

authRoutes.post('/register', (req, res, next) =>
  authController.register(req, res).catch(next)
);
authRoutes.post('/login', (req, res, next) =>
  authController.login(req, res).catch(next)
);
authRoutes.post('/admin/login', (req, res, next) =>
  authController.adminLogin(req, res).catch(next)
);
authRoutes.post('/refresh', (req, res, next) =>
  authController.refresh(req, res).catch(next)
);

module.exports = authRoutes;
