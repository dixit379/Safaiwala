import express from 'express';
import { loginUser, registerUser,getUserAppointments, getProfile, updateProfile, bookService, listServices, cancelService, paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/booking-service", authUser, bookService)
userRouter.get("/services", listServices)
userRouter.post("/cancel-appointment", authUser, cancelService)
userRouter.post("/payment-razorpay", authUser, paymentRazorpay)
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay)
userRouter.get("/appointments", authUser, getUserAppointments); // ✅ Correct method
userRouter.post("/payment-stripe", authUser, paymentStripe)
userRouter.post("/verifyStripe", authUser, verifyStripe)

export default userRouter;