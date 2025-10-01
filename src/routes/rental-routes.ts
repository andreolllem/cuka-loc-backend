import { Router } from "express";
import { body } from "express-validator";
import { authenticate } from "@/middlewares/auth";
import {
  myRentals,
  verifyAvailability,
  storeRental,
  cancel,
  updateStatus,
  allRentals
} from "@/controllers/rental-controller";

const router = Router();

router.use(authenticate);

router.get("/me", myRentals);
router.get("/", allRentals);

router.post(
  "/verificar",
  [body("equipamentoId").isInt(), body("dataInicio").isISO8601(), body("dataFim").isISO8601()],
  verifyAvailability
);

router.post(
  "/",
  [
    body("equipamentoId").isInt(),
    body("dataInicio").isISO8601(),
    body("dataFim").isISO8601(),
    body("successUrl").optional().isURL(),
    body("cancelUrl").optional().isURL()
  ],
  storeRental
);

router.post("/:id/cancelar", cancel);

router.patch("/:id/status", [body("status").isIn(["pendente", "confirmada", "concluida", "cancelada"])], updateStatus);

export default router;
