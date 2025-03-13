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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.changePassword = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const user_model_1 = require("../models/user.model");
const token_utils_1 = require("../utils/token.utils");
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = yield user_model_1.User.create({ name, email, password });
        // // Send welcome email
        // const welcomeMessage = `
        //   <h1>Welcome to Task Manager!</h1>
        //   <p>Hello ${name},</p>
        //   <p>Thank you for registering with Task Manager. We're excited to have you on board!</p>
        //   <p>You can now start creating and managing your tasks.</p>
        //   <p>Best regards,</p>
        //   <p>The Task Manager Team</p>
        // `;
        // await sendWelcomeEmail({
        //   email,
        //   subject: "Welcome to Task Manager!",
        //   message: welcomeMessage,
        // });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.createUser = createUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Please enter all fields" });
            return;
        }
        const user = yield user_model_1.User.findOne({ email })
            .select("+password")
            .populate("tasks");
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        //remove password from user object
        const userWithOutPassword = user.toObject();
        delete userWithOutPassword.password;
        (0, token_utils_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.loginUser = loginUser;
// Logout User
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.logoutUser = logoutUser;
//Change Password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const isMatch = yield user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        user.password = newPassword;
        yield user.save();
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.changePassword = changePassword;
// Get Current User
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const user = req.user;
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.getCurrentUser = getCurrentUser;
