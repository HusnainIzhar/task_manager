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
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_utils_1 = __importDefault(require("../utils/errorHandler.utils"));
const user_model_1 = require("../models/user.model");
// authenticated user
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Skip authentication if this is a build process or test environment
    if (process.env.NODE_ENV === 'build' || process.env.SKIP_AUTH === 'true') {
        console.log('Authentication bypassed for build/test environment');
        // Create a minimal mock user to avoid errors downstream
        req.user = {
            _id: 'build-process-mock-id',
            name: 'Build Process',
            email: 'build@example.com',
        };
        return next();
    }
    const accessToken = req.cookies.access_token;
    // Also check for Authorization header as a fallback
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;
    // Use token from cookie or header
    const token = accessToken || tokenFromHeader;
    if (!token) {
        return next(new errorHandler_utils_1.default("No access token provided", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return next(new errorHandler_utils_1.default("Access Token is not valid", 401));
        }
        // Extract the user ID from the token
        const userId = decoded.id;
        if (!userId) {
            return next(new errorHandler_utils_1.default("Invalid token format", 401));
        }
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            return next(new errorHandler_utils_1.default("User not found", 404));
        }
        // Set the user in the request object
        req.user = user;
        console.log("AccessToken Expiration Time (Middleware):", new Date(decoded.exp * 1000));
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new errorHandler_utils_1.default("Access Token has expired", 401));
        }
        else {
            return next(new errorHandler_utils_1.default("Error decoding access token", 401));
        }
    }
});
exports.isAuthenticated = isAuthenticated;
