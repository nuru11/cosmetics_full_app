const GENDERS = ['MALE', 'FEMALE', 'UNISEX'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'UNAVAILABLE'];
const PRODUCT_VERSIONS = ['ORIGINAL', 'TWO_LEVEL', 'PREMIUM'];

function assertProductEnums(data, { partial = false } = {}) {
  const checks = [
    ['gender', GENDERS],
    ['status', STATUSES],
    ['productVersion', PRODUCT_VERSIONS],
  ];

  for (const [field, allowed] of checks) {
    if (data[field] == null) {
      if (!partial) continue;
      continue;
    }
    const value = String(data[field]).toUpperCase();
    if (!allowed.includes(value)) {
      const err = new Error(
        `Invalid ${field}. Allowed: ${allowed.join(', ')}`
      );
      err.status = 400;
      throw err;
    }
    data[field] = value;
  }

  return data;
}

module.exports = {
  GENDERS,
  STATUSES,
  PRODUCT_VERSIONS,
  assertProductEnums,
};
