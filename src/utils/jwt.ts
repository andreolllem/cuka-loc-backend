import jwt, { type SignOptions } from "jsonwebtoken";
import env from "../config/env";
import { JwtPayload } from "../types";

function isJwtPayload(payload: unknown): payload is JwtPayload {
  if (payload && typeof payload === "object") {
    const candidate = payload as Record<string, unknown>;
    return typeof candidate.sub === "number" && typeof candidate.email === "string";
  }
  return false;
}

export function signJwt(
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "12h"
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, env.jwtSecret, options);
}

export function verifyJwt(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.jwtSecret);
  if (!isJwtPayload(decoded)) {
    throw new Error("Token inválido");
  }
  return decoded;
}
