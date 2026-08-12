import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import ownerRoutes from "/routes/owner.routes.js";
import ownerVerificationRoutes from "./routes/admin/ownerVerification.routes.js";
const app=express();
app.use(express.json());
app.use("/api/auth",authRoutes);
app.get("/",(req,res)=>{
    res.json({
        message:"server is running"
    });
});
app.use("/api/users",userRoutes);
app.use("/api/owner",ownerRoutes);
app.use("/api/admin",ownerVerificationRoutes);
export default app;