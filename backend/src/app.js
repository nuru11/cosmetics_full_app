const express = require('express');
const path = require('path');
const cors = require('cors');
const { config } = require('./config');
const { errorHandler } = require('./middleware/errorHandler');
const { verifyJwt } = require('./middleware/verifyJwt');
const { attachUser } = require('./middleware/auth');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const categoryRoutes = require('./modules/category/category.routes');
const productRoutes = require('./modules/product/product.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const orderRoutes = require('./modules/order/order.routes');
const adminOrderRoutes = require('./modules/order/admin.order.routes');
const uploadRoutes = require('./modules/upload/upload.routes');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (config.corsOrigins.includes(origin)) return callback(null, true);
        callback(null, false);
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(verifyJwt);
  app.use(attachUser);

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin/orders', adminOrderRoutes);
  app.use('/api/uploads', uploadRoutes);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
