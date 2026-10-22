import app from "./app.js";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

const configuredPort = process.env.PORT === undefined ? 5000 : Number(process.env.PORT);

const validateRuntimeConfiguration = () => {
  if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }
  if (process.env.NODE_ENV !== "production") return;

  if (Buffer.byteLength(process.env.JWT_SECRET || "", "utf8") < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes in production.");
  }
  const origins = (process.env.CLIENT_URL || "").split(",").map((origin) => origin.trim());
  if (!process.env.CLIENT_URL || origins.some((origin) => {
    try {
      const parsed = new URL(origin);
      return parsed.protocol !== "https:" || parsed.origin !== origin;
    } catch {
      return true;
    }
  })) {
    throw new Error("CLIENT_URL must contain comma-separated HTTPS frontend origins in production.");
  }
};

try {
  validateRuntimeConfiguration();
  await connectDB();
  const server = app.listen(configuredPort);
  server.on("listening", () => {
    console.log(`ShareLoop backend listening on port ${configuredPort}`);
  });
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${configuredPort} is already in use. Stop the ShareLoop process using it or set PORT to another available port.`);
    } else {
      console.error("Unable to start ShareLoop backend.");
    }
    mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  });
} catch (error) {
  const safeConfigurationMessages = new Set([
    "PORT must be an integer between 1 and 65535.",
    "JWT_SECRET must contain at least 32 bytes in production.",
    "CLIENT_URL must contain comma-separated HTTPS frontend origins in production.",
    "MONGODB_URI is not set. Configure it in backend/.env or the deployment environment.",
  ]);
  if (safeConfigurationMessages.has(error.message)) {
    console.error(`ShareLoop startup configuration error: ${error.message}`);
  } else {
    console.error(`Unable to start ShareLoop backend (${error.name}). Check the MongoDB connection and deployment environment.`);
  }
  process.exitCode = 1;
}
