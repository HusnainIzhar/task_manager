require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: boolean | "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // In minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "30", 10); // In days

const isDevelopment = process.env.NODE_ENV === "development";

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // minutes
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: isDevelopment ? "lax" : "none",
  secure: !isDevelopment,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // days
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: isDevelopment ? "lax" : "none",
  secure: !isDevelopment,
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};