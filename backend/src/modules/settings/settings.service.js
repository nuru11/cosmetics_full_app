const { AppSetting } = require('../../lib/db');

const CONTACT_US_KEY = 'contact_us';
const CONTACT_FIELD_MAX_LENGTH = 255;
const CONTACT_ADDRESS_MAX_LENGTH = 1000;

const CONTACT_FIELDS = ['phone1', 'phone2', 'email', 'address', 'telegram'];

function normalizeOptionalString(value, maxLength) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLength) {
    const err = new Error(`Max length is ${maxLength} characters`);
    err.status = 400;
    throw err;
  }
  return trimmed;
}

function sanitizeContactUs(raw = {}) {
  const next = {};
  for (const field of CONTACT_FIELDS) {
    const maxLength = field === 'address' ? CONTACT_ADDRESS_MAX_LENGTH : CONTACT_FIELD_MAX_LENGTH;
    next[field] = normalizeOptionalString(raw[field], maxLength);
  }
  return next;
}

function toContactUsResponse(value = {}) {
  const next = {};
  for (const field of CONTACT_FIELDS) {
    next[field] = value[field] ?? null;
  }
  return next;
}

function parseSettingValue(value) {
  if (value == null) return {};
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

async function readContactUsValue() {
  const row = await AppSetting.findByPk(CONTACT_US_KEY);
  if (!row) return {};
  return parseSettingValue(row.value);
}

const settingsService = {
  async getContactUs() {
    const value = await readContactUsValue();
    return toContactUsResponse(value);
  },

  async updateContactUs(payload = {}) {
    const contactUs = sanitizeContactUs(payload);
    const existing = await AppSetting.findByPk(CONTACT_US_KEY);
    if (existing) {
      await existing.update({ value: contactUs });
    } else {
      await AppSetting.create({ settingKey: CONTACT_US_KEY, value: contactUs });
    }
    return contactUs;
  },
};

module.exports = { settingsService };
