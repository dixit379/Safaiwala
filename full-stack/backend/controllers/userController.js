import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/bookingModel.js";
import ServiceModel from "../models/ServiceModel.js";
import mongoose from "mongoose";

import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import Razorpay from 'razorpay';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to register user
const registerUser = async (req, res) => {

    try {
        const {name, email, phone, dob, gender, city, address, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password || !phone || !dob || !gender || !city || !address) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            name, email, phone, dob, gender, city, address
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
        
    } catch (error) {
        console.error("Error in registerUser:", error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            
            res.json({ success: true, token,user })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
        
    } catch (error) {
        console.error("Error in loginUser:", error)
        res.json({ success: false, message: error.message })
    }
}
// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password'); // Fetch user
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("✅ Found User:", user); // Debugging

        res.json({ success: true, user }); // ✅ Changed `userData` to `user`

    } catch (error) {
        console.error("❌ Error in get Profile:", error.message);
        res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
    }
};

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;
        const userId = req.user.id; // ✅ Extract userId from req.user

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Data Missing" });
        }

        // ✅ Update user profile details
        await userModel.findByIdAndUpdate(userId, { name, phone, address, dob, gender });

        // ✅ Upload image only if it exists
        if (imageFile && imageFile.path) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.status(200).json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.error("❌ Error in updateProfile:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// API to book appointment 

// const bookService = async (req, res) => {
//     try {
//       const { user, services, date, time, address } = req.body;
  
//       if (!user || !services.length || !date || !time || !address) {
//         return res.status(400).json({ error: "All fields are required!" });
//       }
  
//       const newBooking = new appointmentModel({
//         user,
//         services,
//         date,
//         time,
//         address:address || "Default Address",
//       });
  
//       await newBooking.save();
  
//       res.status(201).json({
//         success: true,
//         message: "Service booked successfully!",
//         booking: newBooking,
//       });
//     } catch (error) {
//       console.error("❌ Booking Error:", error);
//       res.status(500).json({ error: "Internal server error", details: error.message });
//     }
//   };
const bookService = async (req, res) => {
    try {
        const { user, services, date, time, address } = req.body;

        if (!user || !services.length || !date || !time || !address) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Fetch user details from database
        const userData = await userModel.findById(user);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate total amount
        const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

        const newBooking = new appointmentModel({
            user,
            userName: userData.name,  // Storing user name
            userEmail: userData.email, // Storing user email
            services,
            date,
            time,
            address:userData.address || address, // Storing user address
            amount: totalAmount, 
            payment:false // Storing the total amount
        });

        await newBooking.save();
        const savedBooking = await newBooking.save();
        res.status(201).json({
            success: true,
            message: "Service booked successfully!",
            booking: newBooking,
            bookingId: savedBooking._id, 
            invoiceFilename: `${savedBooking._id}.pdf`
        });
    } catch (error) {
        console.error("❌ Booking Error:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// API to cancel appointment
const cancelService = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user?._id;  // ✅ Ensure userId is received

        console.log("📌 Cancel Request:", { bookingId, userId });

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ success: false, message: "Invalid Booking ID" });
        }
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
        }

        const booking = await appointmentModel.findOne({ _id: bookingId, user: userId });

        if (!booking) {
            console.log("❌ Booking not found in DB:", { bookingId, userId });
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        await appointmentModel.findByIdAndDelete(bookingId);
        res.json({ success: true, message: "Service booking canceled" });

    } catch (error) {
        console.error("❌ Error cancelling service:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// API to get user appointments for frontend my-appointments page
const listServices = async (req, res) => {
    try {
        const services = await ServiceModel.find().lean(); // Fetch services and convert to plain objects

        // Add full image paths for service & subcategory images
        const updatedServices = services.map(service => ({
            ...service,
            image: `${process.env.BACKEND_URL}${service.image}`, // Full path for service image
            subcategories: service.subcategories.map(sub => ({
                ...sub,
                image: sub.image ? `${process.env.BACKEND_URL}${sub.image}` : "", // Full path for subcategory image
            })),
        }));

        res.json({ success: true, services: updatedServices });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


const getUserAppointments = async (req, res) => {
        try {
            const userId = req.user.id; // Ensure the user ID is available
            console.log("📌 Fetching Appointments for User ID:", userId);
    
            // Fetch bookings related to the user, including service details
            const bookings = await appointmentModel.find({ user: userId })
                .populate("services.serviceId", "serviceName price") // Populate service details
                .sort({ createdAt: -1 });
    
            if (!bookings || bookings.length === 0) {
                return res.status(404).json({ success: false, message: "No appointments found!" });
            }
    
            res.status(200).json({ success: true, appointments: bookings });
        } catch (error) {
            console.error("❌ Error fetching appointments:", error); // Log the error
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
};


// Razorpay Payment API paymentRazorpay 
const paymentRazorpay = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const bookingData = await appointmentModel.findById(bookingId);
        if (!bookingData) return res.json({ success: false, message: "Booking Not Found" });
        const options = {
            amount: bookingData.amount * 100,
            currency: "INR",
            receipt: bookingId,
        };
        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.log("Razorpay Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Razorpay Payment verifyRazorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe Payment API
const paymentStripe = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const { origin } = req.headers;
        const bookingData = await appointmentModel.findById(bookingId);
        if (!bookingData) return res.json({ success: false, message: "Booking Not Found" });
        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&bookingId=${bookingData._id}`,
            cancel_url: `${origin}/verify?success=false&bookingId=${bookingData._id}`,
            line_items: [{
                price_data: {
                    currency: "INR",
                    product_data: { name: "Service Payment" },
                    unit_amount: bookingData.amount * 100,
                },
                quantity: 1,
            }],
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe Payment
const verifyStripe = async (req, res) => {
    try {
        const { bookingId, success } = req.body;
        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(bookingId, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        }
        res.json({ success: false, message: "Payment Failed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookService,
    listServices,
    getUserAppointments,
    cancelService,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
}