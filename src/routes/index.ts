import { Router } from "express";
import authRoutes from "./auth-routes";
import equipmentRoutes from "./equipment-routes";
import rentalRoutes from "./rental-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/equipamentos", equipmentRoutes);
router.use("/locacoes", rentalRoutes);

export default router;
