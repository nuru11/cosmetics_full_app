const { Router } = require('express');
const { settingsController } = require('./settings.controller');

const settingsRoutes = Router();

settingsRoutes.get('/contact-us', (req, res, next) =>
  settingsController.getContactUs(req, res).catch(next),
);

module.exports = settingsRoutes;
