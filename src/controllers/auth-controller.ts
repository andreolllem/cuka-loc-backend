import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { loginUser, registerUser } from "@/services/auth-service";

export async function register(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  try {
    const { token, usuario } = await registerUser(req.body);
    res.status(201).json({ token, usuario });
  } catch (error: any) {
    res.status(400).json({ mensagem: error.message });
  }
}

export async function login(req: Request, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erros: errors.array() });
  }

  try {
    const { token, usuario } = await loginUser(req.body);
    res.json({ token, usuario });
  } catch (error: any) {
    res.status(401).json({ mensagem: error.message });
  }
}
