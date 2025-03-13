"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv").config();
const dbUrl = process.env.MONGO_URI;
// Cache the database connection
let cachedConnection = null;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const connection = yield mongoose_1.default.connect(dbUrl, options);
        // Cache the connection
        cachedConnection = connection;
        console.log("MongoDB connected successfully");
        return connection;
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        // Don't exit the process in serverless environment, just return the error
        throw error;
    }
});
exports.connectDB = connectDB;
