import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.utils";
import { IUser } from "../models/user.model";

// Define AuthRequest interface
interface AuthRequest extends Request {
  user?: any; // Using 'any' for now to match whatever type is coming from the JWT
}

// authenticated user
export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return;
  }
  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    if (!decoded) {
      return next(new ErrorHandler("Access Token is not valid", 401));
    }
    const user = decoded.user;

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
