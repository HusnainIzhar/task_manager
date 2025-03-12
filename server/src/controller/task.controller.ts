import { Task } from "../models/task.model";
import express, { Request, Response } from "express";
import { IUser } from "../models/user.model";
import mongoose from "mongoose";

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
    console.log("Create Task Request:", { title, description, userId: req.user?._id });

    if (!title || !description) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    if (!req.user || !req.user._id) {
      console.log("User not authenticated properly for task creation");
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const task = await Task.create({ 
      title, 
      description, 
      user: req.user._id,
      status: "pending"
    });

    console.log("Task created:", {
      taskId: task._id,
      userId: task.user
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error in createTask controller:", error);
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
    console.log("Update Task Request:", {
      taskId: req.params.id,
      title,
      description,
      status,
      userId: req.user?._id
    });

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

    console.log("Task updated:", {
      taskId: task._id,
      title: task.title,
      status: task.status
    });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error("Error in updateTask controller:", error);
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
    console.log("Delete Task Request:", {
      taskId: req.params.id,
      userId: req.user?._id
    });
  
    
    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Task not found with ID:", req.params.id);
      res.status(404).json({ message: "Task not found" });
      return;
    }

    console.log("Task found:", {
      taskId: task._id,
      taskUser: task.user,
      requestUser: req.user?._id
    });

  
    if (!task.user) {
      console.log("Task has no user associated with it");
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Task deleted successfully" });
      return;
    }

    // Compare user IDs
    if (task.user.toString() !== req.user?._id?.toString()) {
      console.log("User not authorized. Task user:", task.user.toString(), "Request user:", req.user?._id?.toString());
      res.status(403).json({ message: "Not authorized to delete this task" });
      return;
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in deleteTask controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
