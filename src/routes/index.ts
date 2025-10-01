import { Router } from "express";
import authRoutes from "@/routes/auth-routes";
import equipmentRoutes from "@/routes/equipment-routes";
import rentalRoutes from "@/routes/rental-routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/equipamentos", equipmentRoutes);
router.use("/locacoes", rentalRoutes);

export default router;
