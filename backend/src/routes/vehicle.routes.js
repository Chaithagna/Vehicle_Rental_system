import express from "express";

import {
  addVehicle,
  getVehicleById,
  getMyVehicles,
  getApprovedVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getApprovedVehicles);
router.get("/my", protect, verifyRole("owner"), getMyVehicles);
router.get("/:id", getVehicleById);
router.post("/", protect, verifyRole("owner"), addVehicle);
router.put("/:id", protect, verifyRole("owner"), updateVehicle);
router.delete("/:id", protect, verifyRole("owner"), deleteVehicle);

export default router;