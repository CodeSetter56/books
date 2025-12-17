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
  console.log(email, password);
  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required."));
  }

  try {

    const user = (await User.findOne({ email })) as IUser | null;
    if (!user) return next(createHttpError(400, "Invalid credentials."));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createHttpError(400, "Invalid credentials."));
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({ accessToken });

  } catch (error) {
    return next(createHttpError(500, "Login process failed."));
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return next(createHttpError(401, "Session expired, please login again."));

  try {
    const decoded = verify(refreshToken, config.jwtSecret as string) as {
      sub: string;
    };

    // Generate only a new access token
    const { accessToken } = generateTokens(decoded.sub);
    res.status(200).json({ accessToken });

  } catch (err) {
    res.clearCookie("refreshToken");
    return next(createHttpError(401, "Invalid session."));
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};
