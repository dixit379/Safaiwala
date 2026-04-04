import express from 'express';
import { loginAdmin, appointmentsAdmin, appointmentCancel,updateBookingStatus , addEmployee, allEmployee, adminDashboard } from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/EmployeeController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-Employee", authAdmin, upload.single('image'), addEmployee)
adminRouter.get("/bookings", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-employee", authAdmin, allEmployee)
adminRouter.post("/update-booking-status", authAdmin, updateBookingStatus);
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

export default adminRouter;