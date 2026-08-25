import express from "express";

import {
  getAllPendingVerificationRequests,
  getVerificationById,
  approveOwnerVerification,
  rejectOwnerVerification,
  getApprovedOwners,
} from "../../controllers/admin/owner.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/owner-verifications",
  protect,
  verifyRole("admin"),
  getAllPendingVerificationRequests
);
router.get(
  "/approved-owners",
  protect,
  verifyRole("admin"),
  getApprovedOwners
);

router.get(
  "/:id",
  protect,
  verifyRole("admin"),
  getVerificationById
);
router.put(
  "/:id/approve",
  protect,
  verifyRole("admin"),
  approveOwnerVerification
);
router.put(
  "/:id/reject",
  protect,
  verifyRole("admin"),
  rejectOwnerVerification
);

export default router;
