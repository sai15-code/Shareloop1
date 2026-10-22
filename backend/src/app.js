import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000,http://127.0.0.1:3000").split(",").map((origin) => origin.trim());
app.use(cors({ origin: (origin, callback) => {
  const isLocalDevOrigin = process.env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
  if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin) return callback(null, true);
  const error = new Error("Origin not allowed by CORS");
  error.status = 403;
  callback(error);
} }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    status: databaseConnected ? "healthy" : "degraded",
    services: { api: "up", database: databaseConnected ? "connected" : "disconnected" },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/community", communityRoutes);

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const status = error.status || (error.type === "entity.parse.failed" ? 400 : error.type === "entity.too.large" ? 413 : 500);
  if (status >= 500) {
    console.error("Unhandled API error", { name: error.name, method: req.method, path: req.path });
  }
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
});

export default app;
