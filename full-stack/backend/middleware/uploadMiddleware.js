import multer from "multer";
import upload from "./multer.js"; // ✅ Ensure correct import

// ✅ Allow one service image + multiple subcategory images
const uploadMiddleware = upload.fields([
    { name: "serviceImage", maxCount: 1 }, // Service image
    { name: "subcategoryImages", maxCount: 10 }, // Multiple subcategory images
]);

export default uploadMiddleware;
