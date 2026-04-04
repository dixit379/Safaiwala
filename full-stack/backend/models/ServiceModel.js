import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // ✅ Make sure this field exists
    subcategories: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String }, // ✅ Optional but recommended
        },
    ],
});

export default mongoose.model("Service", serviceSchema);
