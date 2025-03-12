import { User, IUser } from "../models/user.model";
import { Request, Response } from "express";
import { sendToken } from "../utils/token.utils";
import { sendWelcomeEmail } from "../utils/email.utils";
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

    //remove password from user object
    const userWithOutPassword = user.toObject() as any;
    delete userWithOutPassword.password;

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

// Get Current User
export const getCurrentUser: express.RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
