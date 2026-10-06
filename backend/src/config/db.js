import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("MongoDB URI not found. Set MONGODB_URL in backend/.env");
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("mongodb connected successfully to Atlas");
    } catch (error) {
        console.error("mongodb failed to connect:", error.message);
    }
};

export default connectDB;