import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const isLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (token) {
    return next(createHttpError(400, "You are already logged in."));
  }

  next();
};
