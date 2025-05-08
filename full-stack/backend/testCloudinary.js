import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

console.log("🔍 Cloudinary Config Check:");
console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_SECRET_KEY:", process.env.CLOUDINARY_SECRET_KEY ? "✅ Loaded" : "❌ Missing");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});
