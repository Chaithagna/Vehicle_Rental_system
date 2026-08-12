import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});
export const register=async (req,res)=>{
    try{
        const{
            name,email,phone,password
        }=req.body;
        if(!name || !email || !phone || !password){
            return res.status(400).json({
                message:"Name or email or phone or password is required",
            })
        }
        const exsistUser=await User.findOne({email});
        if(exsistUser){
             return res.status(400).json({
                message:"User alreary exists",
             })
        }
        if(!name || !email || !phone || !password){
            return res.status(400).json({
                message:"Name or email or phone or password is required",
            })
        }
        const hashPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            phone,
            password:hashPassword,
            roles:["customer"]
        });
        await user.save();
        return res.status(201).json({
            message:"User created successfully",
        });
        
    }
    catch(error){
        return res.status(500).json({
            message:"Internal server error",
            error:error.message,
        });
    }
}
export const Login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email ||  !password){
        return res.status(400).json({
            message:"Email or password is required",
        })
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"User not found",
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password",
        })
    }
    const token=jwt.sign(
        {
        userId:user._id,
        roles:user.roles
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        },

        
    );
    return res.status(200).json({
        message:"Login successful",
        token
    });
}


