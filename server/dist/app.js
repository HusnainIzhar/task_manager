"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
require("dotenv").config();
//Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Debug middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});
//Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Task Manager API" });
});
app.use("/api/auth", user_route_1.default);
app.use("/api/tasks", task_route_1.default);
//Not found
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found !`);
    err.statusCode = 404;
    next(err);
});
//Error handler
app.use((err, req, res) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
exports.default = app;
