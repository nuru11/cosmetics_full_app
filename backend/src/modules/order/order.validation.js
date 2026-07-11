function validateContact(body = {}) {
  const name = (body.customerName || body.customer_name || '').trim();
  const phoneVal = (body.phone || '').trim();
  const cityVal = (body.city || '').trim();

  if (!name || name.length > 120) {
    const err = new Error('Customer name is required (max 120 characters)');
    err.status = 400;
    throw err;
  }
  if (!phoneVal || phoneVal.length > 20) {
    const err = new Error('Phone is required (max 20 characters)');
    err.status = 400;
    throw err;
  }
  if (!cityVal || cityVal.length > 120) {
    const err = new Error('City is required (max 120 characters)');
    err.status = 400;
    throw err;
  }

  return { customerName: name, phone: phoneVal, city: cityVal };
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Cart is empty');
    err.status = 400;
    throw err;
  }

  const normalized = [];
  for (const row of items) {
    const variantId = (row.variantId || row.variant_id || '').trim();
    const quantity = parseInt(row.quantity, 10);
    if (!variantId || !Number.isFinite(quantity) || quantity < 1) {
      const err = new Error('Invalid cart item');
      err.status = 400;
      throw err;
    }
    normalized.push({ variantId, quantity });
  }
  return normalized;
}

module.exports = { validateContact, validateItems };
