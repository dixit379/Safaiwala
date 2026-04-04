import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        userName: { type: String, required: true }, // Store user name
        userEmail: { type: String, required: true }, // Store user email
        services: [
            {
                serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
                serviceName: { type: String, required: true },
                price: { type: Number, required: true },  // Store service price
            }
        ],
        date: { type: String, required: true },
        time: { type: String, required: true },
        address: { type: String, required: true },
        amount: { type: Number, required: true }, // Store total booking amount
        status: { type: String, default: "Pending" }
    },
    { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
