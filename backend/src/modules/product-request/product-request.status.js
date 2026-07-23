const PRODUCT_REQUEST_STATUSES = ['NEW', 'REVIEWED', 'FULFILLED', 'CLOSED'];

function validateProductRequestStatus(status) {
  const normalized = String(status || '').trim().toUpperCase();
  if (!PRODUCT_REQUEST_STATUSES.includes(normalized)) {
    const err = new Error(
      `Invalid status. Allowed: ${PRODUCT_REQUEST_STATUSES.join(', ')}`
    );
    err.status = 400;
    throw err;
  }
  return normalized;
}

module.exports = { PRODUCT_REQUEST_STATUSES, validateProductRequestStatus };
