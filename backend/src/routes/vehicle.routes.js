import {
    addVehicle,
    getVehicleById,
    getMyVehicles,
    getApprovedVehicles,
    updateVeehicle,
    deleteVehicle

} from "../controllers/vehicle.controller.js";
import {protect} from "../middleware/auth.middleware.js";
import {verifyRole} from "../middleware/role.middleware.js";
