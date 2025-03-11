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

// Parse environment variables
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "3",
  10
);

// Options for token
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// Options for refresh token
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  // Cookie options
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
