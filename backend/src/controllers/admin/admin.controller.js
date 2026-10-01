import User from "../../models/User.js";
import Vehicle from "../../models/Vehicle.js";
import Booking from "../../models/Booking.js";

// ==========================================
// GET ALL USERS
// GET /api/admin/users
// Admin only
// ==========================================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Get all users error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ==========================================
// GET ALL VEHICLES
// GET /api/admin/vehicles
// Admin only
// ==========================================
export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate("owner", "name email phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: vehicles.length,
            vehicles
        });

    } catch (error) {
        console.error("Get all vehicles error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ==========================================
// GET ALL BOOKINGS
// GET /api/admin/bookings
// Admin only
// ==========================================
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer", "name email phone")
            .populate("owner", "name email phone")
            .populate(
                "vehicle",
                "name brand model category catagory pricePerDay images"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};