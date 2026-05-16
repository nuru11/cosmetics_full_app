const { Router } = require('express');
const { requireAuth } = require('../../middleware/auth');
const { userController } = require('./user.controller');

const userRoutes = Router();

userRoutes.get('/me', requireAuth, (req, res, next) =>
  userController.getMe(req, res).catch(next)
);
userRoutes.patch('/me', requireAuth, (req, res, next) =>
  userController.updateMe(req, res).catch(next)
);

module.exports = userRoutes;
