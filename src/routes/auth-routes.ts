import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "@/controllers/auth-controller";

const router = Router();

router.post(
  "/register",
  [
    body("nome").isString().isLength({ min: 3 }),
    body("email").isEmail(),
    body("senha").isLength({ min: 6 }),
    body("telefone").isString().isLength({ min: 10 })
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("senha").isLength({ min: 6 })],
  login
);

export default router;
