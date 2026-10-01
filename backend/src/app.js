const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(morgan("dev"));
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.get("/health", (req, res) =>
  res.json({
    status: "ok",
    service: "banking-api",
    timestamp: new Date().toISOString(),
  }),
);
app.use("/api/v1", routes);
app.use((req, res, next) =>
  next(new AppError("Route not found.", 404, "NOT_FOUND")),
);
app.use(errorHandler);

module.exports = app;
