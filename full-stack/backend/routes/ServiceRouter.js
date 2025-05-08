import express from "express";
import uploadMiddleware from "../middleware/uploadMiddleware.js"; // ✅ Import correctly
import { getServices, addService, deleteService } from "../controllers/ServiceController.js";

const router = express.Router();

// Routes
router.get("/list", getServices);
router.post("/add", uploadMiddleware, addService); // ✅ Ensure uploadMiddleware is applied correctly
router.delete("/delete/:serviceId", deleteService);

export default router;
