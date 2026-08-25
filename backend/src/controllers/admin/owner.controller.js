import OwnerVerification from "../../models/OwnerVerification.js";
import User from "../../models/User.js";

export const getAllPendingVerificationRequests = async (req, res) => {
  try {
    const verifications = await OwnerVerification.find({
      status: "pending",
    }).populate("userId", "name email phone");

    if (!verifications || verifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending verification requests found",
      });
    }

    return res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getVerificationById = async (req, res) => {
  try {
    const verification = await OwnerVerification.findById(req.params.id).populate(
      "userId",
      "name email phone"
    );

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification not found",
      });
    }

    return res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const approveOwnerVerification = async (req, res) => {
  try {
    const verification = await OwnerVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found",
      });
    }

    if (verification.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Verification request already approved",
      });
    }

    verification.status = "approved";
    verification.rejectedReason = null;
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = Date.now();
    await verification.save();

    const user = await User.findById(verification.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.roles.includes("owner")) {
      user.roles.push("owner");
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Owner verification approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
 
export const rejectOwnerVerification = async (req, res) => {
  try {
    const verification = await OwnerVerification.findById(req.params.id);

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found",
      });
    }

    if (verification.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Verification request already rejected",
      });
    }

    verification.status = "rejected";
    verification.rejectedReason = req.body.rejectionReason || "No reason provided";
    verification.reviewedBy = req.user._id;
    verification.reviewedAt = Date.now();
    await verification.save();

    return res.status(200).json({
      success: true,
      message: "Owner verification rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getApprovedOwners = async (req, res) => {
  try {
    const approvedOwners = await OwnerVerification.find({
      status: "approved",
    }).populate("userId", "name email phone");

    return res.status(200).json({
      success: true,
      count: approvedOwners.length,
      approvedOwners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
