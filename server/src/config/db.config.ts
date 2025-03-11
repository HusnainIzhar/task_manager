import mongoose from "mongoose";
require("dotenv").config();

const dbUrl = process.env.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};
