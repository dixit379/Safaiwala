import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const  AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData, setUserData] = useState(null); // 🔄 Changed from `false` to `null`

    // Fetch Employees from API
    const getEmployeesData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/employee/list`);
            if (data.success) {
                setEmployees(data.employees);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch employees");
        }
    };

    // Fetch User Profile from API
    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("API Response:", data); // Debugging
    
            if (data.success && data.user) { // ✅ Change `data.userData` to `data.user`
                setUserData(data.user);
                toast.success("login success");
            } else {
                toast.error("Failed to load user data");
            }
        } catch (error) {
            console.error("not  login:", error.response?.data || error.message);
            toast.error("Not Log In");
        }
    };
    
    
    const getServicesData = async () => {
        try {
            console.log("Fetching services from:", `${backendUrl}/api/service/list`);
            const response = await axios.get(`${backendUrl}/api/service/list`);
    
            if (response.data.success && response.data.services) {
                console.log("✅ Services received:", response.data.services);
                setServices(response.data.services);  // Ensure correct data
            } else {
                console.error("⚠️ Unexpected response format:", response.data);
                setServices([]);  // Prevent undefined errors
            }
        } catch (error) {
            console.error("❌ Error fetching services:", error);
            setServices([]);  // Handle errors gracefully
        }
    };
       
    
    // Sync Token with Local Storage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Load Employees on App Start
    useEffect(() => {
        getEmployeesData();
    }, []);

    // Load User Profile when Token Changes
    useEffect(() => {
        loadUserProfileData();
    }, [token]);
    useEffect(() => {
        getServicesData();
    }, []);
    
    const value = {
        employees,
        getEmployeesData,
        getServicesData ,
        currencySymbol,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
        loadUserProfileData,
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
