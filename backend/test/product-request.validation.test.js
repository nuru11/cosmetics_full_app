'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  validateCreateBody,
  validateDescription,
  validateProductRequestContact,
} = require('../src/modules/product-request/product-request.validation');

test('validateProductRequestContact requires name and phone only', () => {
  const result = validateProductRequestContact({
    customerName: 'Sara',
    phone: '+251911234567',
  });
  assert.equal(result.customerName, 'Sara');
  assert.equal(result.phone, '+251911234567');
});

test('validateProductRequestContact rejects missing phone', () => {
  assert.throws(
    () => validateProductRequestContact({ customerName: 'Sara' }),
    (err) => err.status === 400
  );
});

test('validateDescription requires text when no image', () => {
  assert.throws(
    () => validateDescription({ description: '   ' }),
    (err) => err.status === 400
  );
});

test('validateDescription allows empty text when image is provided', () => {
  const result = validateDescription({
    description: '',
    imageBase64: 'abc123',
  });
  assert.equal(result, '');
});

test('validateCreateBody accepts photo-only request', () => {
  const result = validateCreateBody({
    customerName: 'Sara',
    phone: '+251911234567',
    imageBase64: 'abc123',
  });
  assert.equal(result.description, '');
  assert.equal(result.customerName, 'Sara');
});
