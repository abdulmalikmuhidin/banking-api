const app = require('./app');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');

async function start() {
  await connectDatabase();
  app.listen(env.port, () => console.log(`Banking API listening on port ${env.port}`));
}

start().catch((error) => {
  console.error('Unable to connect to MongoDB:', error.message);
  process.exit(1);
});
