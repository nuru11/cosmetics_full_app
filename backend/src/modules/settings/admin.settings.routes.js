const { Router } = require('express');
const { requireAdmin } = require('../../middleware/auth');
const { settingsController } = require('./settings.controller');

const adminSettingsRoutes = Router();

adminSettingsRoutes.use(requireAdmin);

adminSettingsRoutes.get('/contact-us', (req, res, next) =>
  settingsController.getContactUs(req, res).catch(next),
);
adminSettingsRoutes.put('/contact-us', (req, res, next) =>
  settingsController.updateContactUs(req, res).catch(next),
);

module.exports = adminSettingsRoutes;
