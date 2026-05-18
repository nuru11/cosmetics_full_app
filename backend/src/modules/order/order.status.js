const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function validateOrderStatus(status) {
  const value = (status || '').trim().toUpperCase();
  if (!ORDER_STATUSES.includes(value)) {
    const err = new Error(`Invalid status. Allowed: ${ORDER_STATUSES.join(', ')}`);
    err.status = 400;
    throw err;
  }
  return value;
}

module.exports = { ORDER_STATUSES, validateOrderStatus };
