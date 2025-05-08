import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from "react";


export const AdminContext = createContext()
const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '');

    const [bookings, setBookings] = useState([])
    const [Employee, setEmployee] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all employees data from Database using API
    const getAllEmployee = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/all-employee`, {
                headers: { 
                    Authorization: `Bearer ${aToken}`, // ✅ Correct way to send token
                },
            });
            if (data.success) {
                setEmployee(data.employees); // ✅ Use correct property name
                console
            } else {
                setEmployee([]);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error(error.response?.data?.message || "Failed to fetch employees");
            setEmployee([]);
        }
    };
    // Function to change employee availablity using API
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`, 
                { docId }, 
                { headers: { Authorization: `Bearer ${aToken}` } } // ✅ Correct format
            );
    
            if (data.success) {
                toast.success(data.message);
                getAllEmployee(); // ✅ Refresh employee list
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting all booking data from Database using API
    const getAllBookings = async () => {
        try {
            if (!aToken) {
                toast.error("Admin not logged in");
                return;
            }
    
            const { data } = await axios.get(`${backendUrl}/api/admin/bookings`, { 
                headers: { Authorization: `Bearer ${aToken}` } 
            });
    
            console.log("Bookings API Response:", data);  // Debugging
    
            if (data.success && Array.isArray(data.bookings)) {
                setBookings(data.bookings);  // Correctly update state
            } else {
                setBookings([]);  
                toast.error(data.message || "No bookings found");
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error(error.response?.data?.message || "Failed to fetch bookings");
        }
    };
    
    
    // Function to cancel booking using API
    const cancelBooking = async (bookingId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/cancel-booking`, 
                { bookingId }, 
                { headers: { Authorization: `Bearer ${aToken}` } }
            );
    
            if (data.success) {
                toast.success(data.message);
                getAllBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };
    const updateBookingStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/update-booking-status`,
                { bookingId, status },
                { headers: { Authorization: `Bearer ${aToken}` } }
            );
    
            if (data.success) {
                toast.success("Status updated successfully");
                getAllBookings(); // Refresh bookings
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating booking status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };
    
    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, { 
                headers: { Authorization: `Bearer ${aToken}` } // ✅ Corrected header
            });
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value = {
         aToken,setAToken,
        Employees: Employee,
        getAllEmployee,
        changeAvailability,
        bookings,
        getAllBookings,
        dashData,
        cancelBooking,
        updateBookingStatus ,
        getDashData
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider