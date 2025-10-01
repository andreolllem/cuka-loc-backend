import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/middlewares/auth";
import { index, show, store, update, destroy } from "@/controllers/equipment-controller";

const router = Router();

router.get("/", index);
router.get("/:id", show);

router.post(
  "/",
  authenticate,
  [
    body("nome").isString().notEmpty(),
    body("categoria").isString().notEmpty(),
    body("descricao").isString().notEmpty(),
    body("preco_diaria").isFloat({ gt: 0 }),
    body("disponibilidade").isBoolean(),
    body("imagem_url").isURL()
  ],
  store
);

router.put(
  "/:id",
  authenticate,
  [
    body("nome").optional().isString(),
    body("categoria").optional().isString(),
    body("descricao").optional().isString(),
    body("preco_diaria").optional().isFloat({ gt: 0 }),
    body("disponibilidade").optional().isBoolean(),
    body("imagem_url").optional().isString()
  ],
  update
);

router.delete("/:id", authenticate, destroy);

export default router;
