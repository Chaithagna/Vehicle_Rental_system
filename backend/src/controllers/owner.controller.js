import OwnerVerification from "../models/OwnerVerification.js";

// ==========================================
// SUBMIT OWNER VERIFICATION DETAILS
// POST /api/owner/verify
// ==========================================

export const submitOwnerDetails = async (req, res) => {
  try {
    const {
      aadhaarDocument,
      drivingLicense,
      selfie,
      addressProof,
      bankDetails,
    } = req.body;

    // Check required fields
    if (
      !aadhaarDocument ||
      !drivingLicense ||
      !selfie ||
      !addressProof ||
      !bankDetails
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check whether verification already exists
    const existingVerification = await OwnerVerification.findOne({
      userId: req.user._id,
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: "Owner verification already submitted",
      });
    }

    // Create verification
    const verification = await OwnerVerification.create({
      userId: req.user._id,
      aadhaarDocument,
      drivingLicense,
      selfie,
      addressProof,
      bankDetails,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Owner verification submitted successfully",
      verification,
    });
  } catch (error) {
    console.error("Submit owner verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ==========================================
// GET OWNER VERIFICATION DETAILS
// GET /api/owner/verify
// ==========================================

export const getOwnerVerificationDetails = async (req, res) => {
  try {
    const verification = await OwnerVerification.findOne({
      userId: req.user._id,
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification details not found",
      });
    }

    return res.status(200).json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error("Get owner verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// ==========================================
// UPDATE OWNER VERIFICATION DETAILS
// PUT /api/owner/verify
// ==========================================

export const updateOwnerVerificationDetails = async (req, res) => {
  try {
    const {
      aadhaarDocument,
      drivingLicense,
      selfie,
      addressProof,
      bankDetails,
    } = req.body;

    const verification = await OwnerVerification.findOne({
      userId: req.user._id,
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification details not found",
      });
    }

    const updatedVerification =
      await OwnerVerification.findByIdAndUpdate(
        verification._id,
        {
          aadhaarDocument,
          drivingLicense,
          selfie,
          addressProof,
          bankDetails,
          status: "pending",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Owner verification details updated successfully",
      verification: updatedVerification,
    });
  } catch (error) {
    console.error("Update owner verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};