// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";

// const authUser = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization")?.split(" ")[1];
//         if (!token) {
//             console.error("❌ No token provided");
//             return res.status(401).json({ success: false, message: "No token provided" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("✅ Decoded Token:", decoded);  // Debugging

//         const user = await userModel.findById(decoded.id);
//         if (!user) {
//             console.error("❌ User not found from token:", decoded.id);
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         req.user = user; // Attach user details to request
//         next();
//     } catch (error) {
//         console.error("❌ Authentication Error:", error.message);
//         res.status(401).json({ success: false, message: "Invalid or expired token" });
//     }
// };

// export default authUser;
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Attach user to request

        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        next(); // Proceed to the controller
    } catch (error) {
        console.error("❌ Authentication Error:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authUser;
