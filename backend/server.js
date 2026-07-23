const app = require('./src/app');
const config = require('./src/config/env');
const db = require('./src/config/db');

const PORT = config.port;

const startServer = async () => {
  try {
    // Verify database connection
    await db.raw('SELECT 1');
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Selo Backend API running in [${config.env}] mode on port ${PORT}`);
      console.log(`📡 Healthcheck: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to Database:', err.message);
    process.exit(1);
  }
};

startServer();
