import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "../types";
import { verifyJwt } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }
}
