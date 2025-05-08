import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch services from the backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/service/list`);
                setServices(data.services);
            } catch (err) {
                setError("Failed to load services");
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // ✅ Function to delete a service
    const deleteService = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try {
            const { data } = await axios.delete(`${backendUrl}/api/service/delete/${serviceId}`);

            if (data.success) {
                toast.success("Service deleted successfully");
                setServices((prev) => prev.filter((service) => service._id !== serviceId)); // Remove from UI
            } else {
                toast.error("Failed to delete service");
            }
        } catch (err) {
            console.error("Error deleting service:", err);
            toast.error("Something went wrong");
        }
    };

    if (loading) return <p className="text-center text-gray-600">Loading services...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Service List</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                    <div key={service._id} className="border p-4 rounded shadow-lg">
                        {/* Service Image */}
                        <img
                            src={service.image ? `${backendUrl}${service.image}` : "/default-service.jpg"}
                            alt={service.name}
                            className="w-full h-40 object-cover rounded"
                        />
                        {/* Service Name */}
                        <h2 className="text-lg font-semibold mt-2">{service.name}</h2>

                        {/* Subcategories */}
                        {service.subcategories?.length > 0 ? (
                            <ul className="mt-2">
                                {service.subcategories.map((sub, index) => (
                                    <li key={index} className="text-gray-700">
                                        {sub.name} - <span className="font-semibold">₹{sub.price}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 mt-2">No subcategories available</p>
                        )}

                        {/* Delete Button */}
                        <button
                            onClick={() => deleteService(service._id)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Delete Service
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceList;
