import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {submitOwnerDetails,getOwnerVerificationDetails,updateOwnerVerificationDetails} from "../controllers/owner.controller.js";
const router=express.Router();
router.post("/verify",protect,submitOwnerDetails);
router.get("/verify",protect,getOwnerVerificationDetails);
router.put("/verify",protect,updateOwnerVerificationDetails);
export default router;
