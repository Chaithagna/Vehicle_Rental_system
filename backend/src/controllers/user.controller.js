import User from "../models/User.js";

// ==============================
// Get Logged-in User Profile
// GET /api/users/profile
// ==============================
export const getUserProfile = async (req, res) => {

    try {
        console.log(req.user);
        console.log("req.user._id", req.user._id);
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==============================
// Update Logged-in User Profile
// PUT /api/users/profile
// ==============================
export const updateUserProfile = async (req, res) => {
    try {

        const { name, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                name,
                phone
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==============================
// Get User By ID (Admin)
// GET /api/users/:id
// ==============================
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==============================
// Get All Users (Admin)
// GET /api/users
// ==============================
export const getAllUsers = async (req, res) => {
    try {

        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            totalUsers: users.length,
            users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ==============================
// Suspend User (Admin)
// PUT /api/users/:id/suspend
// ==============================
export const suspendUser = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                isSuspended: true
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User suspended successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};