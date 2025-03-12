"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.refreshTokenOptions = exports.accessTokenOptions = void 0;
require("dotenv").config();
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "5", 10); // In minutes
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "30", 10); // In days
const isDevelopment = process.env.NODE_ENV === "development";
exports.accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 1000), // minutes
    maxAge: accessTokenExpire * 60 * 1000,
    httpOnly: true,
    sameSite: isDevelopment ? "lax" : "none",
    secure: !isDevelopment,
};
exports.refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // days
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isDevelopment ? "lax" : "none",
    secure: !isDevelopment,
};
const sendToken = (user, statusCode, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    res.cookie("refresh_token", refreshToken, exports.refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        accessToken,
        user,
    });
});
exports.sendToken = sendToken;
