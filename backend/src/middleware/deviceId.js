const DEVICE_HEADER = 'x-client-device-id';
const MIN_LEN = 8;
const MAX_LEN = 64;

function requireDeviceId(req, res, next) {
  const raw = req.headers[DEVICE_HEADER];
  const deviceId = typeof raw === 'string' ? raw.trim() : '';

  if (!deviceId || deviceId.length < MIN_LEN || deviceId.length > MAX_LEN) {
    res.status(400).json({ error: 'Missing or invalid X-Client-Device-Id header' });
    return;
  }

  req.clientDeviceId = deviceId;
  next();
}

module.exports = { requireDeviceId, DEVICE_HEADER };
