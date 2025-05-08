import jwt from "jsonwebtoken";
import appointmentModel from "../models/bookingModel.js";
// import doctorModel from "../models/doctorModel.js";
import Employeemodel from "../models/Employeemodel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if admin exists
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "90d" });

        res.json({ success: true, token }); // ✅ Send token to frontend

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


const appointmentsAdmin = async (req, res) => {
    try {
        console.log("📡 Fetching Appointments from Database...");

        const bookings = await appointmentModel.find({});

        console.log("📝 Fetched Appointments:", bookings); // Debugging output

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({ success: true, message: "No bookings found", bookings: [] });
        }

        res.json({ success: true, bookings });

    } catch (error) {
        console.error("🚨 Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addEmployee = async (req, res) => {

    try {

        const { name, email, password, experience, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !experience || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
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

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const Employeedata = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            experience,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newEmployee = new Employeemodel(Employeedata)
        await newEmployee.save()
        res.json({ success: true, message: 'Employee Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allEmployee = async (req, res) => {
    try {
        console.log("Fetching all employees..."); // Debugging
        const employees = await Employeemodel.find();
        console.log("Employees found:", employees); // Log data

        if (!employees.length) {
            return res.status(404).json({ success: false, message: "No employees found" });
        }

        res.json({ success: true, employees });
    } catch (error) {
        console.error("Error fetching employees:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await Employeemodel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }    
}
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;

        if (!bookingId || !status) {
            return res.status(400).json({ success: false, message: "Missing booking ID or status" });
        }

        const updatedBooking = await appointmentModel.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Status updated", booking: updatedBooking });

    } catch (error) {
        console.error("Error updating booking status:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addEmployee,
    allEmployee,
    updateBookingStatus,
    adminDashboard
}