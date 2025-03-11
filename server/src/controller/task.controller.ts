import { Task } from "../models/task.model";
import express, { Request, Response } from "express";
import { IUser } from "../models/user.model";

interface AuthRequest extends Request {
  user?: IUser; 
}

// Create Task
export const createTask: express.RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const task = await Task.create({ title, description, user: req.user?._id });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// Get Tasks
export const getTasks: express.RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user?._id });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// Update Task
export const updateTask: express.RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true }
    );

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// Delete Task
export const deleteTask: express.RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
