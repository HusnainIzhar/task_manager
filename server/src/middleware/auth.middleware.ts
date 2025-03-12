import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.utils";
import { IUser, User } from "../models/user.model";

// Define AuthRequest interface
interface AuthRequest extends Request {
  user?: IUser; // Using proper IUser type to match the controller
}

// authenticated user
export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return next(new ErrorHandler("No access token provided", 401));
  }
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access Token is not valid", 401));
    }
    
    // Extract the user ID from the token
    const userId = decoded.id;
    
    if (!userId) {
      return next(new ErrorHandler("Invalid token format", 401));
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Set the user in the request object
    req.user = user;

    console.log(
      "AccessToken Expiration Time (Middleware):",
      new Date(decoded.exp! * 1000)
    );
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Access Token has expired", 401));
    } else {
      return next(new ErrorHandler("Error decoding access token", 401));
    }
  }
};
