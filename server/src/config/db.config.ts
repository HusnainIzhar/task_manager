import mongoose from "mongoose";
require("dotenv").config();

const dbUrl = process.env.MONGO_URI as string;

// Cache the database connection
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async () => {
  // If connection already exists, reuse it
  if (cachedConnection) {
    console.log("Using existing MongoDB connection");
    return cachedConnection;
  }

  // Add serverless-friendly options for MongoDB connection
  try {
    console.log("Connecting to MongoDB...");
    
    // Add timeout and poolSize options for faster connections
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      connectTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 connections
      minPoolSize: 1, // Maintain at least 1 connection
    };

    const connection = await mongoose.connect(dbUrl, options);
    
    // Cache the connection
    cachedConnection = connection;
    
    console.log("MongoDB connected successfully");
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Don't exit the process in serverless environment, just return the error
    throw error;
  }
};
