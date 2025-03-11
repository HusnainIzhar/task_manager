import { User, IUser } from "../models/user.model";
import { Request, Response } from "express";
import { sendToken } from "../utils/token.utils";
import express from "express";

// Extend the Request interface with the user property
interface AuthRequest extends Request {
  user?: IUser;
}

// Create User
export const createUser: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// Login User
export const loginUser: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("tasks");

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    sendToken(user, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// Logout User
export const logoutUser: express.RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

//Change Password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
