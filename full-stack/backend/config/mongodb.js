import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGO_URI is not defined in .env file");
    process.exit(1); // Stop server if no MongoDB URI
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${MONGODB_URI}/prescripto`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;