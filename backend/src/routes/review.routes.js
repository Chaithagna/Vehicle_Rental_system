import express from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getVehicleReviews,
  getMyReviews,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:vehicleId", protect, verifyRole("customer", "owner"), getVehicleReviews);
router.get("/my", protect, verifyRole("customer"), getMyReviews);
router.put("/:id", protect, verifyRole("customer"), updateReview);
router.delete("/:id", protect, verifyRole("customer"), deleteReview);

export default router;