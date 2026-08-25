import mongoose from "mongoose";

const ownerVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    aadhaarDocument: {
      type: String,
      required: true,
    },

    drivingLicense: {
      type: String,
      required: true,
    },

    selfie: {
      type: String,
      required: true,
    },

    addressProof: {
      type: String,
      required: true,
    },

    bankDetails: {
      accountHolderName: {
        type: String,
        required: true,
      },

      accountNumber: {
        type: String,
        required: true,
      },

      ifscCode: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    rejectedReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const OwnerVerification = mongoose.model(
  "OwnerVerification",
  ownerVerificationSchema
);

export default OwnerVerification;