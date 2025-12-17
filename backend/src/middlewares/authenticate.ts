import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Auth failed: No token provided");
    return next(createHttpError(401, "Authorization token is required."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token as string, config.jwtSecret as string) as {
      sub: string;
    };
    const _req = req as AuthRequest;
    _req.userId = decoded.sub;

    console.log("Authenticated User ID:", _req.userId);
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return next(createHttpError(401, "Token expired or invalid."));
  }
};

export default authenticate;
