import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordMinLength = 8;
const passwordMaxBytes = 72;

const isValidPassword = (password) =>
  password.length >= passwordMinLength &&
  Buffer.byteLength(password, "utf8") <= passwordMaxBytes;

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw httpError(500, "JWT_SECRET is not configured");
  }
  return process.env.JWT_SECRET;
};

const safeProfile = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateRegistration = ({ name, email, password }) => {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    throw httpError(400, "Name, email, and password are required");
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedName.length < 2 || normalizedName.length > 80) {
    throw httpError(400, "Name must be between 2 and 80 characters");
  }
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    throw httpError(400, "Enter a valid email address");
  }
  if (!isValidPassword(password)) {
    throw httpError(
      400,
      `Password must be at least ${passwordMinLength} characters and no more than ${passwordMaxBytes} bytes`,
    );
  }

  return { name: normalizedName, email: normalizedEmail, password };
};

const register = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw httpError(400, "Request body must be a JSON object");
  }
  const { name, email, password } = validateRegistration(req.body);

  if (await User.exists({ email })) {
    throw httpError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await User.create({ name, email, passwordHash });
  } catch (error) {
    if (error.code === 11000) {
      throw httpError(409, "An account with this email already exists");
    }
    if (error.name === "ValidationError") {
      throw httpError(400, "Invalid registration details");
    }
    throw error;
  }

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: { user: safeProfile(user) },
  });
};

const login = async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw httpError(400, "Request body must be a JSON object");
  }
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    throw httpError(400, "Email and password are required");
  }
  if (!isValidPassword(password)) {
    throw httpError(
      400,
      `Password must be at least ${passwordMinLength} characters and no more than ${passwordMaxBytes} bytes`,
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    throw httpError(400, "Enter a valid email address");
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw httpError(401, "Invalid email or password");
  }

  const token = jwt.sign({ sub: user.id }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { token, user: safeProfile(user) },
  });
};

const getCurrentUser = (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: safeProfile(req.user) },
  });
};

export { getCurrentUser, login, register };
