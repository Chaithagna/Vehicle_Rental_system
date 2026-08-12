import {
    addVehicle,
    getVehicleById,
    getMyVehicles,
    getApprovedVehicles,
    updateVehicle,
    deleteVehicle

} from "../controllers/vehicle.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import {verifyRole} from "../middleware/role.middleware.js";
// Get all approved vehicles
router.get("/", getAllVehicles);


// Get owner's vehicles
// IMPORTANT: /my must come before /:id
router.get(
    "/my",
    protect,
    verifyRole("owner"),
    getMyVehicles
);


// Get one approved vehicle
router.get("/:id", getVehicleById);


// ==========================================
// OWNER
// ==========================================

// Add vehicle
router.post(
    "/",
    protect,
    verifyRole("owner"),
    addVehicle
);


// Update vehicle
router.put(
    "/:id",
    protect,
    verifyRole("owner"),
    updateVehicle
);


// Delete vehicle
router.delete(
    "/:id",
    protect,
    verifyRole("owner"),
    deleteVehicle
);

export default router;