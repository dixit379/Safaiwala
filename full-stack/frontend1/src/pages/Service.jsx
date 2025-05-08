import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Service = () => {
  const [services, setServices] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");
  const [selectedDate, setSelectedDate] = useState(() => {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/service/list");
        if (response.data.success) {
          setServices(response.data.services);
          setSelectedService(response.data.services[0] || null);
        } else {
          console.error("Error fetching services:", response.data.message);
        }
      } catch (error) {
        console.error("Axios Error:", error);
      }
    };
    fetchServices();
  }, []);

  const handleServiceClick = (service) => {
    setSelectedService(service); // Highlight the selected category but don't clear selected services.
  };

  const handleSubcategoryClick = (sub) => {
    setSelectedServices((prev) => {
      if (prev.some((s) => s._id === sub._id)) {
        return prev.filter((s) => s._id !== sub._id); // Remove if already selected
      } else {
        return [...prev, sub]; // Add new selection
      }
    });
  };

  const handleBooking = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not logged in. Please login first.");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));

    const formattedAddress = typeof userAddress === "object"
      ? `${userAddress.line1}, ${userAddress.line2}, ${userAddress.street}, ${userAddress.city}`
      : userAddress;

    const totalAmount = selectedServices.reduce((total, service) => total + Number(service.price || 0), 0);

    const bookingData = {
      user: userId,
      userName: userData?.name,
      userEmail: userData?.email,
      services: selectedServices.map(service => ({
        serviceId: service._id,
        serviceName: service.name,
        price: service.price
      })),
      date: selectedDate,
      time: selectedTime,
      address: formattedAddress || "Default Address",
      amount: totalAmount,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/booking-service`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const bookingId = response.data.bookingId;
        toast.success("Booking successful! Redirecting to payment...");
        handlePayment(bookingId);  // 👈 Call handlePayment immediately
      } else {
        toast.error(response.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("❌ Booking Error:", error.response?.data || error.message);
      toast.error("Booking failed. Please try again.");
    }
  };


  const handlePayment = async (bookingId) => {
    try {
      if (!bookingId) {
        toast.error("Booking ID is missing!");
        return;
      }

      console.log("📌 Booking ID:", bookingId); // Debugging

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const { order } = response.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          handler: async function (paymentResult) {
            console.log("📌 Payment Result:", paymentResult); // Debugging

            // Send full payment details for verification
            const verifyResponse = await axios.post(
              `${backendUrl}/api/user/verifyRazorpay`,
              {
                razorpay_order_id: paymentResult.razorpay_order_id,
                razorpay_payment_id: paymentResult.razorpay_payment_id,
                razorpay_signature: paymentResult.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("📌 Verify Payment Response:", verifyResponse.data); // Debugging

            if (verifyResponse.data.success) {
              toast.success("✅ Payment successful! Redirecting...");
              setTimeout(() => navigate("/my-appointments"), 2000); // ✅ Redirect after 2 seconds
            } else {
              toast.error("❌ Payment verification failed!");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("Payment failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-6">
      <div className="w-1/4 bg-white shadow-lg p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Services</h2>
        <ul>
          {services.map((service) => (
            <li
              key={service._id}
              className={`p-3 rounded-md cursor-pointer text-gray-700 ${selectedService?._id === service._id ? "bg-blue-500 text-white" : "hover:bg-gray-200"
                }`}
              onClick={() => handleServiceClick(service)}
            >
              {service.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 bg-white shadow-lg p-6 ml-6 rounded-lg">
        {selectedService ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">{selectedService.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedService.subcategories?.map((sub) => (
                <div
                  key={sub._id}
                  className={`p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 ${selectedServices.some((s) => s._id === sub._id) ? "bg-green-200 border-green-500" : ""
                    }`}
                  onClick={() => handleSubcategoryClick(sub)}
                >
                  <img
                    src={
                      sub.image.startsWith("http") // If stored as full URL (Cloudinary or online)
                        ? sub.image
                        : `${backendUrl}${sub.image.startsWith("/uploads/") ? sub.image : `/uploads/${sub.image}`}` // Ensure proper path handling
                    }
                    alt={sub.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                    onError={(e) => (e.target.style.display = "none")} // Hide broken images
                  />
                  <h3 className="text-lg font-semibold">{sub.name}</h3>
                  <p className="text-gray-600">Price: ₹{sub.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Booking Details</h3>
              <label className="block mb-2">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                min={(() => {
                  let tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return tomorrow.toISOString().split("T")[0];
                })()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />

              <label className="block mb-2">Select Time:</label>
              <div className="flex gap-2 flex-wrap">
                {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-md border ${selectedTime === time ? "bg-blue-500 text-white border-blue-500" : "hover:bg-gray-200"
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <label className="block mb-2">Address (Optional):</label>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter your address"
              className="border p-2 rounded-md w-full mb-4"
            />
            {selectedServices.length > 0 && (
              <div className="mt-6 bg-gray-200 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
                <ul>
                  {selectedServices.map((s) => (
                    <li key={s._id} className="p-2 rounded-md mb-1 font-semibold">
                      {s.name} - ₹{s.price}
                    </li>
                  ))}
                </ul>
                <p className="text-xl font-bold mt-4">
                  Total: ₹{selectedServices.reduce((total, s) => total + Number(s.price || 0), 0)}
                </p>
              </div>
            )}

            <button
              onClick={handleBooking}
              className="mt-6 px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Proceed to Payment
            </button>
          </>
        ) : (
          <p className="text-gray-500">Select a service to see details</p>
        )}
      </div>
    </div>
  );
};

export default Service;
