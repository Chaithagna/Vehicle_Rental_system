import {
    getPendingVehicles,
    getVehicleForApproval,
    approveVehicle,
    rejectVehicle
} from "../controllers/admin/vehicle.controller.js";


import {protect} from ".../middleware/auth.middleware.js";
import {verifyRole} from ".../middleware/role.middleware.js";
import express from "express";
const router=express.Router();
// ==========================================
// ADMIN VEHICLE APPROVAL ROUTES
// ==========================================

// Get all pending vehicles



// Get all pending vehicles
router.get(
    "/vehicles/pending",
    protect,
    verifyRole("admin"),
    getPendingVehicles
);

// Get one vehicle for review
router.get(
    "/vehicles/:id",
    protect,
    verifyRole("admin"),
    getVehicleForApproval
);

// Approve vehicle
router.put(
    "/vehicles/:id/approve",
    protect,
    verifyRole("admin"),
    approveVehicle
);

// Reject vehicle
router.put(
    "/vehicles/:id/reject",
    protect,
    verifyRole("admin"),
    rejectVehicle
);
export default router;



