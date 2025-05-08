import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const AllBooking = () => {
    const { bookings, getAllBookings, updateBookingStatus } = useContext(AdminContext);

    useEffect(() => {
        getAllBookings();
    }, []);

    const handleStatusChange = (bookingId, newStatus) => {
        updateBookingStatus(bookingId, newStatus);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">All Bookings</h1>

            {bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                            <h2 className="text-xl font-semibold text-blue-700 mb-3">
                                Service: {booking.services?.[0]?.serviceName || "N/A"}
                            </h2>
                            <p className="text-gray-700"><strong>Name:</strong> {booking.userName || "N/A"}</p>
                            <p className="text-gray-700"><strong>Email:</strong> {booking.userEmail || "N/A"}</p>
                            <p className="text-gray-700"><strong>Date:</strong> {booking.date || "N/A"}</p>
                            <p className="text-gray-700"><strong>Time:</strong> {booking.time || "N/A"}</p>
                            <p className="text-gray-700"><strong>Address:</strong> {booking.address || "N/A"}</p>
                            <p className="text-gray-700"><strong>Amount:</strong> ₹{booking.amount || "N/A"}</p>

                            <p className={`text-sm font-semibold mt-2 px-3 py-1 rounded-full ${
                                booking.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                                booking.status === "Completed" ? "bg-green-200 text-green-800" :
                                "bg-red-200 text-red-800"
                            }`}>
                                {booking.status || "Pending"}
                            </p>

                            {/* Status dropdown */}
                            <select
                                className="mt-3 block w-full border rounded p-2 text-sm"
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg text-gray-600">No bookings found</p>
            )}
        </div>
    );
};

export default AllBooking;
