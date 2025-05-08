import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'


const MyAppointments = () => {
    const { token } = useContext(AppContext); // Get token from context
    const [appointments, setAppointments] = useState([]);

    const getUserAppointments = async () => {
        console.log("📌 Sending Token:", token); // Debugging
    
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/appointments`,
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Send token
            );
    
            console.log("✅ Appointments received:", response.data);
            setAppointments(response.data.appointments);
        } catch (error) {
            console.error("❌ Error fetching appointments:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to fetch appointments.");
        }
    };
    

    useEffect(() => {
        if (token) getUserAppointments();
    }, [token]);

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {
        console.log("📌 Sending Cancel Request for:", appointmentId);
    
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/cancel-appointment`, 
                { bookingId: appointmentId },  // ✅ Ensure correct key
                { headers: { Authorization: `Bearer ${token}` } }  // ✅ Send token
            );
    
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("❌ Error cancelling appointment:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to cancel appointment.");
        }
    };
    
    
    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                console.log(response);
    
                try {
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/api/user/verifyRazorpay`, 
                        response, 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
    
                    if (data.success) {
                        toast.success("Payment Successful!");
                        navigate("/my-appointments");  // 👈 Redirect to "My Appointments" page
                    } else {
                        toast.error("Payment Failed!");
                    }
                } catch (error) {
                    console.error("❌ Payment Verification Error:", error);
                    toast.error(error.message);
                }
            }
        };
    
        const rzp = new window.Razorpay(options);
        rzp.open();
    };
    

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
        {appointments.length > 0 ? (
            <div className="grid gap-4">
                {appointments.map((appointment, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.services[0]?.serviceName || "Service Name"}</h3>
                        <p className="text-gray-700">Date: {appointment.date}</p>
                        <p className="text-gray-700">Time: {appointment.time}</p>
                        <p className="text-gray-700">Address: {appointment.address}</p>
                        <p className="text-gray-700">Amount Paid: ₹{appointment.amount}</p>
                        <p className={`text-sm font-semibold ${appointment.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>Status: {appointment.status}</p>
                        <div className="mt-3 flex space-x-2">
                            {appointment.status !== 'Cancelled' && (
                                <button 
                                    onClick={() => cancelAppointment(appointment._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >Cancel</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-gray-500">No appointments found.</p>
        )}
    </div>
    )
}

export default MyAppointments