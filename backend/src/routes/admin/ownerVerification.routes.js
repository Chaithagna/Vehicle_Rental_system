import {getAllPendingVerificationRequests
    ,getVerificationById,
    approveOwnerVerification,
    rejectOwnerVerification,
    getApprovedOwners} from "../controllers/admin/owner.controller.js";
import express from "express";
import {admin} from "../middleware/auth.middleware.js";
import {protect} from "..middleware/role.middleware.js";
const router=express.Router();
reouter.get("/owner-verifications",protect,admin,getAllPendingVerificationRequests);
router.get("/owner-verifications/:id",protect,admin,getVerificationById);
router.put("/owner-verifications/:id/approve",protect,admin,approveOwnerVerification);
roter.put("/owner-verifications/:id/reject",protect,admin,rejectOwnerVerification);
router.get("/approved-owners",protect,admin,getApprovedOwners);
export default router; 