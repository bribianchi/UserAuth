import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const { JWT_SECRET_KEY } = process.env;

export const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied, token missing." });
  }
  const token = authHeader.split(' ')[1];

  try {
    const payload: any = jwt.verify(token, JWT_SECRET_KEY);
    if (payload.type !== 'access') {
      return res
        .status(401)
        .json({ error: "Invalid token, please login again." });
    }

    // req.user = payload.user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session timed out, please login again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Invalid token, please login again." });
    } else {
      console.error(error);
      return res.status(400).json({ error });
    }
  }
};