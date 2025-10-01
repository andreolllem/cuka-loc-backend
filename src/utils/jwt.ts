import jwt from "jsonwebtoken";
import env from "@/config/env";
import { JwtPayload } from "@/types";

export function signJwt(payload: JwtPayload, expiresIn = "12h") {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
