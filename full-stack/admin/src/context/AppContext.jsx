import axios from "axios"; // ✅ Import Axios
import { toast } from "react-toastify"; // ✅ Import Toast
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toast Styles
import { createContext ,useEffect,useState} from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const [services, setServices] = useState([]);
    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }
    const getServicesData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/service/list`); // Updated URL
            console.log("Services Data:", data);
            setServices(data.services); // Save data in state
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error(error.response?.data?.message || "Failed to fetch services");
        }
    };
    

    useEffect(() => {
        getServicesData();
    }, []);
    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider