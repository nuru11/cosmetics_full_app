const { settingsService } = require('./settings.service');

const settingsController = {
  async getContactUs(req, res) {
    const contactUs = await settingsService.getContactUs();
    res.json({ contactUs });
  },

  async updateContactUs(req, res) {
    const body = req.body || {};
    const payload = body.contactUs && typeof body.contactUs === 'object' ? body.contactUs : body;
    const contactUs = await settingsService.updateContactUs(payload);
    res.json({ contactUs });
  },
};

module.exports = { settingsController };
