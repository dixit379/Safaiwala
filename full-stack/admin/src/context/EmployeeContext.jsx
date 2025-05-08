import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const EmployeeContext = createContext()

const EmployeeContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [bookings, setBookings] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)

    // Getting Doctor appointment data from Database using API
    const getBookings = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/Employee/bookings', { headers: { dToken } })

            if (data.success) {
                setBookings(data.bookings.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/employee/profile', { headers: { dToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelBooking = async (bookingId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/Employee/cancel-booking', { bookingId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getBookings()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completebooking = async (bookingId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/Employee/complete-booking', { bookingId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getBookings()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/employee/dashboard', { headers: { dToken } })

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
        dToken, setDToken, backendUrl,
        bookings,
        getBookings,
        cancelBooking,
        completebooking,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <EmployeeContext.Provider value={value}>
            {props.children}
        </EmployeeContext.Provider>
    )


}

export default EmployeeContextProvider