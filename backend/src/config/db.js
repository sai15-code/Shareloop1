import mongoose from "mongoose";

const connectDB = async () => {
  const { MONGODB_URI } = process.env;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Configure it in backend/.env or the deployment environment.");
  }

  const connection = await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
};

export default connectDB;
