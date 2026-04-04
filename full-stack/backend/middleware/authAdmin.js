import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.warn("Unauthorized Access Attempt: No Token Provided");
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract Bearer Token

        if (!token) {
            console.warn("Token Extraction Failed");
            return res.status(401).json({ success: false, message: "Invalid token format" });
        }

        console.log("Extracted Token:", token); // Debugging: Log token

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token Verification Error:", err.message);
                return res.status(401).json({
                    success: false,
                    message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
                });
            }

            req.admin = decoded; // Store decoded admin data in request
            console.log("Admin Verified:", decoded); // Debugging: Log admin details
            next();
        });

    } catch (error) {
        console.error("Authentication Middleware Error:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export default adminAuth;
