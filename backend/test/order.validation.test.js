'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateContact, validateItems } = require('../src/modules/order/order.validation');

test('validateContact accepts valid payload', () => {
  const result = validateContact({
    customerName: 'Sara',
    phone: '+96170123456',
    city: 'Beirut',
  });
  assert.equal(result.customerName, 'Sara');
  assert.equal(result.phone, '+96170123456');
  assert.equal(result.city, 'Beirut');
});

test('validateContact rejects missing phone', () => {
  assert.throws(
    () => validateContact({ customerName: 'Sara', city: 'Beirut' }),
    (err) => err.status === 400
  );
});

test('validateItems normalizes product ids', () => {
  const items = validateItems([
    { productId: 'abc', quantity: 2 },
    { product_id: 'def', quantity: 1 },
  ]);
  assert.deepEqual(items, [
    { productId: 'abc', quantity: 2 },
    { productId: 'def', quantity: 1 },
  ]);
});

test('validateItems rejects empty cart', () => {
  assert.throws(() => validateItems([]), (err) => err.status === 400);
});
