import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
require("dotenv").config();

const CLIENT_URL = process.env.CLIENT_BASE_URL || "http://localhost:3000";
console.log("Using CLIENT_URL for CORS:", CLIENT_URL);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Debug middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

//Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Task Manager API" });
});

app.use("/api/auth", userRouter);
app.use("/api/tasks", taskRouter);

//Not found
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found !`) as Error & {
    statusCode?: number;
  };
  err.statusCode = 404;
  next(err);
});

//Error handler
app.use((err: Error & { statusCode?: number }, req: Request, res: Response) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
