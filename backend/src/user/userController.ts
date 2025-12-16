import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

import { User } from "./userModel";
import { config } from "../config/config";
import { IUser } from "./userTypes";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      createHttpError(400, "Name, email, and password are required.")
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "Email already in use."));
    }

    const hashedpass = await bcrypt.hash(password, 10);

    const newUser: IUser = await User.create({
      name,
      email,
      password: hashedpass,
    });

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "1d",
    });

    res.status(200).json({ accessToken: token });

  } catch (error) {
    return next(createHttpError(500, (error as Error).message));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      createHttpError(400, "email and password are required.")
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "User not found."));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials."));
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "1d",
    });

    res.status(200).json({ accessToken: token });

  } catch (error) {
    return next(createHttpError(500, (error as Error).message));
  }
};

export { createUser, loginUser };
