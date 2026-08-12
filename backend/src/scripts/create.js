import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});
const createAdminUser = async () => {
    try {
        console.log("Connecting to MongoDB...");

        console.log(
            "MONGO_URI exists:",
            !!process.env.MONGO_URI
        );
        const url="mongodb+srv://vehicle_db:123vehicle@cluster0.pglswty.mongodb.net/vehicle_rental";

        await mongoose.connect(url);

        console.log("MongoDB connected successfully");

        const existingAdmin = await User.findOne({
            roles: "admin"
        });

        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            "admin@123",
            10
        );

        const adminUser = new User({
            name: "Admin",
            email: "chaithagna@gmail.com",
            phone: "1234567890",
            password: hashedPassword,
            roles: ["admin","customer"]
        });

        await adminUser.save();

        console.log("Admin user created successfully");

    } catch (error) {
        console.error(
            "Error creating admin user:",
            error
        );

    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    }
};

createAdminUser();