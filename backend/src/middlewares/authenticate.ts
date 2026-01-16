import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Extract token from cookies instead of header
  const token = req.cookies.accessToken;

  if (!token) {
    return next(createHttpError(401, "Authentication required."));
  }

  try {
    const decoded = verify(token, config.jwtSecret as string) as { sub: string };
    (req as AuthRequest).userId = decoded.sub;
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token."));
  }
};

export default authenticate;
