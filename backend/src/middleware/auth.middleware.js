import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
export const protect=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"Not authorized no token",
        });
    }
    try{
        const decode=jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const userId = decode.id || decode.userId;
        const user=await User.findById(userId).
                    select("-password");
        if(!user){
            return res.status(401).json({
                message:"Not authorized user not found",
            })
        }
        req.user=user;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Not authorized token failed",
            error:error.message,
        })
    }

}