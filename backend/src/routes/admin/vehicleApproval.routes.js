import express from "express";

import {
  getPendingVehicles,
  getVehicleForApproval,
  approveVehicle,
  rejectVehicle,
} from "../../controllers/admin/vehicleapproval.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/pending",
  protect,
  verifyRole("admin"),
  getPendingVehicles
);

router.get(
  "/:id",
  protect,
  verifyRole("admin"),
  getVehicleForApproval
);

router.put(
  "/:id/approve",
  protect,
  verifyRole("admin"),
  approveVehicle
);

router.put(
  "/:id/reject",
  protect,
  verifyRole("admin"),
  rejectVehicle
);

export default router;

