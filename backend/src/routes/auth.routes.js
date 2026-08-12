import {Login,register} from "../controllers/auth.controller.js";
import express from "express";
const router=express.Router();
router.post("/register",register);
router.post("/login",Login);
export default router;