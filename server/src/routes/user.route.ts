import * as express from "express";
const userRouter = express.Router();
import {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controller/user.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/user", isAuthenticated, getCurrentUser);

export default userRouter;
