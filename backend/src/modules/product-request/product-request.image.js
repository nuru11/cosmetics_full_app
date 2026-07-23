const fs = require('fs');
const path = require('path');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const UPLOAD_FOLDER = 'product-requests';

function saveProductRequestImage(imageBase64) {
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return null;
  }

  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  let buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch {
    const err = new Error('Invalid base64 image data');
    err.status = 400;
    throw err;
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    const err = new Error('Image size must be 5MB or less');
    err.status = 413;
    throw err;
  }

  const uploadsRoot = path.join(__dirname, '..', '..', '..', 'uploads');
  const targetDir = path.join(uploadsRoot, UPLOAD_FOLDER);

  fs.mkdirSync(targetDir, { recursive: true });

  const filename = `product_request_${Date.now()}.png`;
  const filePath = path.join(targetDir, filename);

  try {
    fs.writeFileSync(filePath, buffer);
  } catch {
    const err = new Error('Failed to save image');
    err.status = 500;
    throw err;
  }

  return `/uploads/${UPLOAD_FOLDER}/${filename}`;
}

module.exports = { saveProductRequestImage };
