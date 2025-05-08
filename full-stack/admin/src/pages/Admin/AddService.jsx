import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddService = () => {
    const [serviceName, setServiceName] = useState("");
    const [image, setImage] = useState(null);
    const [subcategories, setSubcategories] = useState([{ name: "", price: "", image: null }]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubcategoryChange = (index, field, value) => {
        const updatedSubcategories = [...subcategories];
        updatedSubcategories[index][field] = value;
        setSubcategories(updatedSubcategories);
    };

    const handleSubcategoryImageChange = (index, e) => {
        const updatedSubcategories = [...subcategories];
        updatedSubcategories[index].image = e.target.files[0]; // Store image file
        setSubcategories(updatedSubcategories);
    };

    const addSubcategory = () => {
        setSubcategories([...subcategories, { name: "", price: "", image: null }]);
    };

    const removeSubcategory = (index) => {
        const updatedSubcategories = subcategories.filter((_, i) => i !== index);
        setSubcategories(updatedSubcategories);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("serviceName", serviceName);
        formData.append("serviceImage", image); // ✅ Ensure field name matches backend
    
        // Convert subcategories into a JSON string
        formData.append("subcategories", JSON.stringify(
            subcategories.map((subcategory) => ({
                name: subcategory.name,
                price: subcategory.price,
            }))
        ));
    
        // Attach each subcategory image separately
        subcategories.forEach((subcategory, index) => {
            if (subcategory.image) {
                formData.append(`subcategoryImages`, subcategory.image); // ✅ Append images correctly
            }
        });
    
        try {
            const { data } = await axios.post(`${backendUrl}/api/service/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            if (data.success) {
                toast.success("Service added successfully");
                navigate("/service-list");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("❌ Error in request:", error.response?.data || error.message);
            toast.error("Failed to add service");
        }
    };
    

    return (
        <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Add Service</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Service Name"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2 w-full"
                    required
                />

                <h3 className="text-lg font-bold mt-3">Subcategories</h3>
                {subcategories.map((sub, index) => (
                    <div key={index} className="flex flex-col gap-2 p-2 border rounded">
                        <input
                            type="text"
                            placeholder="Subcategory Name"
                            value={sub.name}
                            onChange={(e) => handleSubcategoryChange(index, "name", e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={sub.price}
                            onChange={(e) => handleSubcategoryChange(index, "price", e.target.value)}
                            className="border p-2 w-full"
                            required
                        />
                        <input
                            type="file"
                            name="iamge"
                            accept="image/*"
                            onChange={(e) => handleSubcategoryImageChange(index, e)}
                            className="border p-2 w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeSubcategory(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addSubcategory}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Add Subcategory
                </button>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Add Service
                </button>
            </form>
        </div>
    );
};

export default AddService;
