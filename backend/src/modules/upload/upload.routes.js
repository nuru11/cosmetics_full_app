const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('../../middleware/auth');

const uploadRoutes = Router();
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

uploadRoutes.post('/', requireAuth, (req, res) => {
  const { imageBase64, folder = 'images' } = req.body || {};

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'imageBase64 is required' });
    return;
  }

  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  let buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
  } catch {
    res.status(400).json({ error: 'Invalid base64 image data' });
    return;
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    res.status(413).json({ error: 'Image size must be 5MB or less' });
    return;
  }

  const safeFolder = String(folder).replace(/[^a-z0-9_-]/gi, '') || 'images';
  const uploadsRoot = path.join(__dirname, '..', '..', '..', 'uploads');
  const targetDir = path.join(uploadsRoot, safeFolder);

  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch {
    // continue
  }

  const filename = `${safeFolder}_${Date.now()}.png`;
  const filePath = path.join(targetDir, filename);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Failed to save upload', err);
      res.status(500).json({ error: 'Failed to save image' });
      return;
    }

    const urlPath = `/uploads/${safeFolder}/${filename}`;
    res.status(201).json({ url: urlPath });
  });
});

module.exports = uploadRoutes;
