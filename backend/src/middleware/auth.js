const { User, Admin } = require('../lib/db');
const { adminService } = require('../modules/admin/admin.service');

async function attachUser(req, res, next) {
  const userId = req.userId;
  if (!userId) {
    next();
    return;
  }

  try {
    if (req.actor === 'admin') {
      const admin = await Admin.findOne({ where: { id: userId } });
      if (admin) req.admin = admin.toJSON();
    } else {
      const user = await User.findOne({ where: { id: userId } });
      if (user) req.user = user.toJSON();
    }
  } catch {
    // optional attachment
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.userId && !req.user && !req.admin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

/** Continues without 401 when no token; use with verifyJwt (optional Bearer). */
function optionalAuth(req, res, next) {
  next();
}

function requireAdmin(req, res, next) {
  if (req.admin && req.admin.status === 'ACTIVE') {
    next();
    return;
  }

  const role = req.user?.role || req.userRole;
  if (role === 'ADMIN' || adminService.isStaffRole(role)) {
    next();
    return;
  }

  res.status(403).json({ error: 'Admin only' });
}

module.exports = { attachUser, requireAuth, optionalAuth, requireAdmin };
