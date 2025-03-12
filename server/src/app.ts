import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";
require("dotenv").config();

// Remove trailing slash from CLIENT_URL if present
const CLIENT_URL = process.env.CLIENT_BASE_URL ? process.env.CLIENT_BASE_URL.replace(/\/$/, '') : "https://task-manager-black-ten.vercel.app";

// Allow multiple origins for different environments
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://46.202.162.244:9000'
];

console.log("CORS configured with allowed origins:", allowedOrigins);

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS, origin:", origin);
        callback(null, true); // Allow all origins in development - remove in production
      }
    },
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
