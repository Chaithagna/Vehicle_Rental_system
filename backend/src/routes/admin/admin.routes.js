import express from "express";

import {
    getAllUsers,
    getAllVehicles,
    getAllBookings
} from "../../controllers/admin/admin.controller.js";

import { protect } from "../../middleware/auth.middleware.js";
import { verifyRole } from "../../middleware/role.middleware.js";

const router = express.Router();

// ==========================================
// GENERAL ADMIN ROUTES
// ==========================================

// Get all users
router.get(
    "/users",
    protect,
    verifyRole("admin"),
    getAllUsers
);

// Get all vehicles
router.get(
    "/vehicles",
    protect,
    verifyRole("admin"),
    getAllVehicles
);

// Get all bookings
router.get(
    "/bookings",
    protect,
    verifyRole("admin"),
    getAllBookings
);

export default router;