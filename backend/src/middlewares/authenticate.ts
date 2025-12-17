import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  // Early return if header is missing or incorrect format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("[Auth Middleware] Access denied: No Bearer token provided.");
    return next(createHttpError(401, "Authorization token is required."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token as string, config.jwtSecret as string) as {
      sub: string;
    };
    const _req = req as AuthRequest;
    _req.userId = decoded.sub;

    console.log(`[Auth Middleware] User authenticated: ${_req.userId}`);
    next();
  } catch (err) {
    console.error(
      "[Auth Middleware] Token verification failed:",
      (err as Error).message
    );
    return next(createHttpError(401, "Token expired or invalid."));
  }
};

export default authenticate;
