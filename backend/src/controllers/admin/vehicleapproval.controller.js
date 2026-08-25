import Vehicle from "../../models/Vehicle.js";

export const getPendingVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "pending" })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending vehicles found",
      });
    }

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getVehicleForApproval = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate("owner", "name email phone");

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const approveVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (vehicle.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Vehicle already approved",
      });
    }

    vehicle.status = "approved";
    vehicle.rejectionReason = null;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const rejectVehicle = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (vehicle.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Vehicle already rejected",
      });
    }

    vehicle.status = "rejected";
    vehicle.rejectionReason = rejectionReason;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Vehicle rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
