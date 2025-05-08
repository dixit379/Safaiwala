import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { state } = useLocation();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [userAddress, setUserAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const subcategory = state?.subcategory || null;

  useEffect(() => {
    // Fetch user details to get their registered address (Mock API call)
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/user/details");
        if (response.data.success) {
          setUserAddress(response.data.user.address);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.warning("Please select a date for booking.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/service/book", {
        serviceId,
        subcategoryId: subcategory._id,
        date: selectedDate,
        address: userAddress,
      });

      if (response.data.success) {
        toast.success("Booking confirmed!");
        navigate("/my-bookings");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to book service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return subcategory ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{subcategory.name}</h2>
        <p className="text-gray-600 mb-2">Price: ₹{subcategory.price}</p>

        <label className="block text-gray-700 mb-2">Select Date:</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md mb-4"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <label className="block text-gray-700 mb-2">Your Address:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-4"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white py-2 px-6 rounded-md w-full"
          onClick={handleBooking}
          disabled={loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-500">No service selected.</p>
  );
};

export default Appointment;
