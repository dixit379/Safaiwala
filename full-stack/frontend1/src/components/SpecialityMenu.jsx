import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SpecialityMenu = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch services from backend
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

    if (loading) return <p className="text-center text-gray-600">Loading services...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-[#262626]">
            <h1 className="text-3xl font-medium">Find by Speciality</h1>
            <p className="sm:w-1/3 text-center text-sm">
                Browse through our list of services and book hassle-free.
            </p>
            <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
                {services.map((service) => (
                    <Link
                        to="/service"
                        onClick={() => scrollTo(0, 0)}
                        className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                        key={service._id}
                    >
                        <img
                            className="w-20 sm:w-24 mb-2 rounded-full shadow-md"
                            src={service.image ? `${backendUrl}${service.image}` : "/default-service.jpg"}
                            alt={service.name}
                        />
                        <p>{service.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SpecialityMenu;