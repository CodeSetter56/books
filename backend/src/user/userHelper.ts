import { Response } from "express";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

export const generateTokens = (userId: string) => {
  const accessToken = sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: config.refreshToken.tokenExpiry.access as any,
  });

  const refreshToken = sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: config.refreshToken.tokenExpiry.refresh as any,
  });

  return { accessToken, refreshToken };
};

// Sets the refresh token in a secure HTTP-Only cookie
export const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(config.refreshToken.cookieName, refreshToken, {
    httpOnly: true, // Defends against XSS
    secure: config.env === "production",
    sameSite: "strict", // Defends against CSRF
    maxAge: config.refreshToken.cookieMaxAge,
  });
};
