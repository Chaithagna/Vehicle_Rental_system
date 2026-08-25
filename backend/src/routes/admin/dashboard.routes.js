import express from "express";
import {getDashBoardStats} from "../../controllers/admin/dashboard.controller.js";
import {protect} from "../../middleware/auth.middleware.js";
import {verifyRole} from "../../middleware/role.middleware.js";

const router=express.Router();

router.get("/stats",protect,verifyRole("admin"),getDashBoardStats);
export default router;