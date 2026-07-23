const { validateContact } = require('../order/order.validation');

function validateDescription(body = {}) {
  const description = (body.description || '').trim();
  if (!description || description.length < 10) {
    const err = new Error('Description is required (min 10 characters)');
    err.status = 400;
    throw err;
  }
  if (description.length > 2000) {
    const err = new Error('Description must be 2000 characters or less');
    err.status = 400;
    throw err;
  }
  return description;
}

function validateCreateBody(body = {}) {
  const description = validateDescription(body);
  const contact = validateContact(body);
  return { description, ...contact };
}

module.exports = { validateCreateBody, validateDescription };
