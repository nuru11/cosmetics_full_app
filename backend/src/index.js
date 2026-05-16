const { config } = require('./config');
const { createApp } = require('./app');
const { sequelize } = require('./lib/db');

const app = createApp();
const port = config.port;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

start();
