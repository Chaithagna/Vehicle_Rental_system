import express from "express";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getOwnerBookingRequests,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { verifyRole } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, verifyRole("customer"), createBooking);
router.get("/my", protect, verifyRole("customer"), getMyBookings);
router.put("/:id/cancel", protect, verifyRole("customer"), cancelBooking);
router.get("/owner", protect, verifyRole("owner"), getOwnerBookingRequests);
router.put("/:id/status", protect, verifyRole("owner"), updateBookingStatus);
router.get("/:id", protect, verifyRole("customer", "owner"), getBookingById);

export default router;

