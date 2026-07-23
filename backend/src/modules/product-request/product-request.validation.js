function hasReferenceImage(body = {}) {
  return Boolean((body.imageBase64 || '').trim());
}

function validateDescription(body = {}) {
  const description = (body.description || '').trim();
  const hasImage = hasReferenceImage(body);

  if (!description && !hasImage) {
    const err = new Error('Description or reference photo is required');
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

function validateProductRequestContact(body = {}) {
  const name = (body.customerName || body.customer_name || '').trim();
  const phoneVal = (body.phone || '').trim();

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

  return { customerName: name, phone: phoneVal };
}

function validateCreateBody(body = {}) {
  const description = validateDescription(body);
  const contact = validateProductRequestContact(body);
  return { description, ...contact };
}

module.exports = {
  validateCreateBody,
  validateDescription,
  validateProductRequestContact,
  hasReferenceImage,
};
