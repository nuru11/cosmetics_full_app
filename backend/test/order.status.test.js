'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateOrderStatus, ORDER_STATUSES } = require('../src/modules/order/order.status');

test('validateOrderStatus accepts PENDING', () => {
  assert.equal(validateOrderStatus('pending'), 'PENDING');
});

test('validateOrderStatus rejects invalid status', () => {
  assert.throws(() => validateOrderStatus('confirmed'), (err) => err.status === 400);
});

test('ORDER_STATUSES includes expected values', () => {
  assert.deepEqual(ORDER_STATUSES, [
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]);
});
