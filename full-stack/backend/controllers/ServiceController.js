import ServiceModel from "../models/ServiceModel.js";
import multer from "multer";
import path from "path";

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure uploads folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage }).fields([
    { name: "serviceImage", maxCount: 1 }, // Main service image
    { name: "subcategoryImages", maxCount: 10 }, // Multiple subcategory images
]);

// Get All Services
export const getServices = async (req, res) => {
    try {
        const services = await ServiceModel.find();
        res.json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Service with Subcategory Images
export const addService = async (req, res) => {
    try {
        console.log("🟢 Received request to add service:", req.body);
        console.log("🟡 Uploaded files:", req.files);

        const { serviceName, subcategories } = req.body;

        if (!req.files || !req.files.serviceImage) {
            return res.status(400).json({ success: false, message: "Service image is required!" });
        }

        const serviceImagePath = `/uploads/${req.files.serviceImage[0].filename}`;

        // ✅ Ensure subcategories is a valid JSON array
        let parsedSubcategories = [];
        if (subcategories) {
            try {
                parsedSubcategories = JSON.parse(subcategories);
                if (!Array.isArray(parsedSubcategories)) {
                    throw new Error("Invalid subcategories format");
                }
            } catch (error) {
                return res.status(400).json({ success: false, message: "Invalid subcategories data" });
            }
        }

        // ✅ Assign subcategory images properly
        parsedSubcategories = parsedSubcategories.map((subcategory, index) => ({
            name: subcategory.name,
            price: subcategory.price,
            image: req.files.subcategoryImages?.[index] 
                ? `/uploads/${req.files.subcategoryImages[index].filename}`
                : "", // Assign empty string if no image
        }));

        const newService = new ServiceModel({
            name: serviceName,
            image: serviceImagePath,
            subcategories: parsedSubcategories,
        });

        await newService.save();
        res.json({ success: true, message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("🔴 Error adding service:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete Service
export const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const deletedService = await ServiceModel.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        res.json({ success: true, message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};