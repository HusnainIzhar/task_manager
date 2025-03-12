import * as express from "express";
const taskRouter = express.Router();
import {
  createTask,
  deleteTask,
  updateTask,
  getTasks,
} from "../controller/task.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

taskRouter.post("/create", isAuthenticated, createTask);
taskRouter.post("/update/:id", isAuthenticated, updateTask);
taskRouter.get("/getAll", isAuthenticated, getTasks);
taskRouter.delete("/delete/:id", isAuthenticated, deleteTask);

export default taskRouter;
