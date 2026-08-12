import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {verifyRole} from "../middleware/role.middleware.js";
import {
    getUserProfile,
    updateUserProfile,
    getUserById,
    getAllUsers,
    suspendUser
} from "../controllers/user.controller.js";
const router=express.Router();
//user API's
router.get("/profile",protect,getUserProfile);
router.put("/profile",protect,updateUserProfile);
//Admin API's
router.get("/",protect,verifyRole("admin"),getAllUsers);
router.get("/:id/suspend",protect,verifyRole("admin"),suspendUser);
router.get("/:id",protect,verifyRole("admin"),getUserById);
export default router;