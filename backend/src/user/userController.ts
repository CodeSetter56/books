import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";

import { generateTokens, setRefreshTokenCookie } from "./userHelper";
import { config } from "../config/config";
import { IUser } from "./userTypes"; 
import { User } from "./userModel";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  if (!name || !email || !password) {
    return next(
      createHttpError(400, "Name, email, and password are required.")
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createHttpError(400, "Email already in use."));

    const hashedpass = await bcrypt.hash(password, 10);

    const newUser: IUser = await User.create({
      name,
      email,
      password: hashedpass,
    });

    const { accessToken, refreshToken } = generateTokens(newUser._id);
    setRefreshTokenCookie(res, refreshToken);

    console.log(`[Register] Successfully created user: ${newUser._id}`);

    res.status(201).json({ accessToken });

  } catch (error) {
    return next(createHttpError(500, "User registration failed."));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(`[Auth] Login attempt for email: ${email}`);

  try {
    const user = (await User.findOne({ email })) as IUser | null;

    // Check user and password in one go
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.warn(`[Auth] Failed login for ${email}: Invalid credentials`);
      return next(createHttpError(401, "Invalid email or password"));
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    console.log(`[Auth] Success: User ${user._id} logged in`);
    res.status(200).json({ accessToken });
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