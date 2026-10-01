const app = require("./app");
const env = require("./config/env");
const { connectDatabase } = require("./config/database");
const PORT = process.env.PORT || 5000;
async function start() {
  await connectDatabase();
  app.listen(PORT, () => console.log(`Banking API listening on port ${PORT}`));
}

start().catch((error) => {
  console.error("Unable to connect to MongoDB:", error.message);
  process.exit(1);
});
