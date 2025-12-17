import { Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

export const generateTokens = (userId: string) => {
  const accessToken = sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: "15m", // Short-lived for security
  });

  const refreshToken = sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: "7d", // Long-lived for session persistence
  });

  return { accessToken, refreshToken };
};

// Sets the refresh token in a secure HTTP-Only cookie
export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Defends against XSS
    secure: config.env === "production",
    sameSite: "strict", // Defends against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

