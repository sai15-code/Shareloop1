import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }
  return process.env.JWT_SECRET;
};

const requireAuth = asyncHandler(async (req, res, next) => {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^\s*Bearer\s+(\S+)\s*$/i);
  if (!match) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }
  const token = match[1];

  let payload;
  try {
    payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
  } catch (error) {
    if (error.status === 500) throw error;
    const unauthorized = new Error("Invalid or expired token");
    unauthorized.status = 401;
    throw unauthorized;
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.sub !== "string" ||
    !/^[a-f\d]{24}$/i.test(payload.sub)
  ) {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    throw error;
  }

  const user = await User.findById(payload.sub).select("name email createdAt updatedAt");
  if (!user) {
    const error = new Error("Invalid or expired token");
    error.status = 401;
    throw error;
  }

  req.user = user;
  next();
});

export default requireAuth;
