import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

import { generateTokens, setRefreshTokenCookie } from "./userHelper";
import { config } from "../config/config";
import { IUser } from "./userTypes"; 
import { User } from "./userModel";
import { AuthRequest } from "../middlewares/authenticate";


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return next(createHttpError(400, "Name, email, and password are required."));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createHttpError(400, "Email already in use."));

    const hashedpass = await bcrypt.hash(password, 10);
    const newUser: IUser = await User.create({ name, email, password: hashedpass });

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    
    // Set both tokens as HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return next(createHttpError(500, "User registration failed."));
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = (await User.findOne({ email })) as IUser | null;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(createHttpError(401, "Invalid email or password"));
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set Access Token Cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(createHttpError(500, "Internal Server Error during login"));
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies[config.refreshToken.cookieName];

  if (!token) {
    console.warn("[Auth] Refresh failed: No cookie present");
    return next(createHttpError(401, "Session expired. Please login again."));
  }

  try {
    const decoded = verify(token, config.jwtSecret as string) as {
      sub: string;
    };
    const { accessToken } = generateTokens(decoded.sub);

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error("[Auth] Refresh token verification failed, clearing cookie");
    res.clearCookie(config.refreshToken.cookieName);
    return next(createHttpError(401, "Invalid session"));
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie(config.refreshToken.cookieName);
  console.log("[Auth] User logged out, cookie cleared");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUserSelf = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(createHttpError(500, "Error fetching user profile"));
  }
};